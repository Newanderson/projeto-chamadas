
import { useState, useContext} from 'react'
import './signin.css'
import logo from '../../assets/logo.png'
import { Link } from'react-router-dom'
import { AuthContext} from '../../contexts/auth'


export default function SingIn(){
   
    const [email, setEmail] = useState('');
    const [password, setPassword]= useState('');

    
    const { signIn, loadingAuth } = useContext(AuthContext);

    //função de login
     async function handleSignin(e){
        e.preventDefault();
    
        if(email !== '' && password !== '')
        await signIn(email, password);

    }




    return(
        <div className='container-center'>
         <div className='login'>
            <div className='login-area'>
                <img src={logo} alt='logo sistema chamada'/>

            </div>

            <form onSubmit={handleSignin}>
                <h1>Entar</h1>
                <input type='text' placeholder='exempo@gmail.com'
                value={email}
                onChange={(e)=> setEmail(e.target.value)}
                />

                <input type='password' 
                value={password}
                onChange={(e)=> setPassword(e.target.value)}
                />

               <button type='submit'>
                {loadingAuth ? "Carregando..." : "Acessar"}
               </button>

             
            </form>
            <Link to="/register"> Criar uma conta</Link>

         </div>
        </div>
    )
}