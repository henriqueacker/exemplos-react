import {createContext, useState, useEffect} from 'react';
import firebase from '../services/firebaseConnection';
import {toast} from 'react-toastify';
export const AuthContext = createContext({});
function AuthProvider({children}){
    const [user, setUser] =useState(null);
    const [loadingAuth, setLoadingAuth]= useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
       
        function loadStorage(){
            const storageUser = localStorage.getItem('SistemaUser');
            if(storageUser){
                setUser(JSON.parse(storageUser));
                setLoading(false);
            }
            setLoading(false);
    
        }

        loadStorage();
    },[])
    //Cadastrando usuario
    async function signUp(email,password, nick){
        setLoadingAuth(true);
        await firebase.auth().createUserWithEmailAndPassword(email,password)
        .then(async(value)=>{
        let uid = value.user.uid;
        await firebase.firestore().collection('users')
        .doc(uid).set({
            nick: nick,
            avatarUrl:null,
        })
        .then (()=>{
            let data = {
                uid: uid ,
                nick: nick,
                email: value.user.email,
                avatarUrl: null
            };
            setUser(data);
            storageUser(data);
            setLoadingAuth(false);
            })
        })
        .catch((error)=>{
            toast.error(`${error}`);
            setLoadingAuth(false);
            
        })
    }
    function storageUser(data){
        localStorage.setItem('SistemaUser', JSON.stringify(data));
    }
    //Logout do Sistema
    async function signOut(){
        await firebase.auth().signOut;
        localStorage.removeItem('SistemaUser');
        setUser(null);
    }
    //Fazendo login
    async function signIn(email, password){
        setLoadingAuth(true);
        await firebase.auth().signInWithEmailAndPassword(email,password)
        .then(async(value)=>{
            let uid = value.user.uid;

            const userProfile = await firebase.firestore().collection('users')
            .doc(uid).get();
            let data ={
                uid: uid,
                nick: userProfile.data().nick,
                avatarUrl: userProfile.data().avatarUrl,
                email: value.user.email
            };
            setUser(data);
            storageUser(data);
            setLoadingAuth(false);
        })
        .catch((error)=>{
            setLoadingAuth(false);
            toast.error('Login/Senha inválido!');
        })
    }
    return (
        <AuthContext.Provider value={{
         signed: !!user,
         user,
         loading,
         signUp,
         signOut,
         signIn,
         loadingAuth, 
         setUser,
         storageUser
         }}>
            {children}
        </AuthContext.Provider>
    )
}
export default AuthProvider;