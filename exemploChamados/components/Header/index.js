import { useContext } from 'react';
import './header.css';
import { AuthContext } from '../../contexts/auth';
import avatar from '../../assets/avatar.png';
import {Link} from 'react-router-dom';
import { FiHome,FiUser,FiUsers, FiSettings,FiPhoneCall } from "react-icons/fi";
export default function Header(){
    const {user} = useContext(AuthContext);
    return(
        <div className='sidebar'>
            <div>

               <img  src={user.avatarUrl == null? avatar: user.avatarUrl}/> 
            </div>
            <Link to="/dashboard">
            <FiHome color="#FFF" size={24}/>Home

            </Link>
            <Link to="/dashboard">
            <FiUsers color="#FFF" size={24}/>Amigos
            </Link>

            <Link to="/profile">
            <FiSettings color="#FFF" size={24}/>Editar Meu Perfil
            </Link>

            <Link to="/clientes">
            <FiPhoneCall color="#FFF" size={24}/>Chamados
            </Link>

            


        </div>
    )
}