import { useContext, useState } from 'react'
import Header from '../../components/Header'
import Title from '../../components/Title'

import { FiSettings, FiUpload } from 'react-icons/fi'
import avatar from '../../assets/avatar.png'
import {AuthContext} from '../../contexts/auth'
import { doc, updateDoc } from 'firebase/firestore'
import  { db, storage } from '../../services/firebaseConnection'
import { toast } from 'react-toastify'
import { ref, uploadBytes, getDownloadURL} from 'firebase/storage'

import './profile.css';

export default function Profile(){

  const { user, storageUser, setUser, logout } = useContext(AuthContext);


  //armazenar dados do usuario
  const [ nome,setNome] = useState(user && user.nome)
  const [ email,setEmail] = useState(user && user.email)

  //armazenar files da troca de imagem
  const [ imageAvatar, setImageAvatar ] = useState(null);


  //mandando a URL
  const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl)


  //função troca imegem do perfil
  function handleFile(e){
    if(e.target.files[0]){
      const image = e.target.files[0];

      if(image.type === 'image/jpeg' || image.type === 'image/png'){
        setImageAvatar(image)
        //Gerando URL para a imagem
        setAvatarUrl(URL.createObjectURL(image))
      }else{
        alert("Envie uma imagem do tipo PNG ou JPEG")
        setImageAvatar(null);
        return;
      }

    }

  }

  //Função mudar dados no FIrebase: nome e imagem
  async function handleUpload(){

    const currentUid = user.uid;


    const uploadRef = ref(storage, `images/${currentUid}/${imageAvatar.name}`)

    const uploadTask = uploadBytes(uploadRef,imageAvatar)
  
    .then((snapshot) => {
      getDownloadURL(snapshot.ref).then(async(getDownloadURL) =>{
        let urlFoto = getDownloadURL;

        const docRef = doc(db,"users",user.uid)
        await updateDoc(docRef,{

          avatarUrl:urlFoto,
          nome:nome,
        })
        .then(()=>{
          let data = {
            ...user,
            nome:nome,
            avatarUrl:urlFoto,
          }
          setUser(data);
          storageUser(data);
          toast.success("Atualizado")
  
  
        })
       

      })
      
    })

  }
 








  //Função mudar dados no FIrebase: nome 
  async function handleSubmit(e){
    e.preventDefault();
    
    if(imageAvatar === null && nome !== ''){
      //atualizar apenas o  nome
      const docRef = doc(db, "users", user.uid)
      await updateDoc(docRef,{
        nome:nome,
      
      })
      .then(()=>{
        let data = {
          ...user,
          nome:nome,
        }
        setUser(data);
        storageUser(data);
        toast.success("Atualizado")


      })
    } else if(nome !== '' && imageAvatar !== null){
      //atualizar tanto o nome quanto a foto
      handleUpload()

    }

  }





  return(
    <div>
      <Header/>

      <div className="content">
        <Title name="Minha conta">
          <FiSettings size={25} />
        </Title>

       <div className="container">

        <form className="form-profile" onSubmit={handleSubmit}>
          <label className="label-avatar">
            <span>
             
            </span>
             
             
            <input  accept="image/*" onChange={handleFile}/> <br/>
            {avatarUrl === null ? (
              <img src={avatar} alt="Foto de perfil" width={250} height={250} />
            ) : (
              <img src={avatarUrl} alt="" width={250} height={250} />
            )}

          </label>

          <label>Nome</label>
          <input type="text" value={nome} onChange={(e) => setNome(e.target.value)
          // tudo que o usuario digitar vai passar para o setNome, vai passa para useState nome.
          
          
          }/>
           

          <label>Email</label>

          <input type="text" value={email} disabled={true} />
          
          <button type="submit">Salvar</button>
        </form>

       </div>

       <div className="container">
         <button className="logout-btn"
         onClick={ () => logout() }    >Sair</button>
       </div>

      </div>

    </div>
  )
}