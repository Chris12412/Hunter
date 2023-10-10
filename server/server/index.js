import express from "express";
import http from "http";
import morgan from "morgan";
import { Server as SocketServer } from "socket.io";
import fetch from "node-fetch";

import { PORT } from "./config.js";
import cors from "cors";

// Initializations

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));

const usuariosConectados = []
let respuestaConexion = false;

const cerrarSesion = async (sesion, token) => {
  const response = await fetch('https://beedronewebapi.abexa.pe/api/Query/cerrarSesion', {
    method:'PUT',
    body: JSON.stringify({
      codUsuarioSesion:sesion,
    }),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    }
  }).then(res => res.json());

  console.log("token => ", token)
  console.log(response)
  if(response.isValid) {
    console.log("USUARIO DESCONECTADO CORRECTAMENTE")
  }
}

io.on("connection", (socket) => {
  console.log("nueva conexion al socket->",socket.id);
  let usuariosRepetidos = 0
  
  socket.on("validarSesion", usuarioSocket =>{ ////OK PRIMERA VALIDACION PARA VER SI ESTA EN EL LISTADO
    if (usuariosConectados.length !== 0){      
        usuariosConectados.forEach(usuario => {
          if(usuario.usuario == usuarioSocket.usuario){
            // usuariosRepetidos++            
          }
        })        
    }else{
      usuariosRepetidos=0
    }
    
    if (usuariosRepetidos == 0){
      const nuevoUsuario = { id: socket.id, usuario: usuarioSocket.usuario, sesion: usuarioSocket.sesion, token: usuarioSocket.token } 
      // usuariosConectados.push(nuevoUsuario)
      respuestaConexion = true
    }else{
      respuestaConexion = false
    }
    respuestaConexion? console.log("conexion aceptada") : console.log("conexion rechazada")
    socket.emit("respuestaConexion", respuestaConexion)
    console.log("USUARIOS CONECTADOS ValidarSesion-> ", usuariosConectados)
    usuariosRepetidos = 0
  })

  socket.on("registrarSocket", usuarioSocket => {
    
    usuariosConectados.forEach(usuario=>{
      
      if(usuario.usuario == usuarioSocket.usuario){
        usuario.id = socket.id
        usuario.token = usuarioSocket.token

        // if (usuariosConectados.length != 0){    
          
          usuariosRepetidos++  
            // if (usuario.sesion == usuarioSocket.sesion ){
            //   // socket.emit("matarSesion", true)
            //   usuario.id = socket.id
            //   usuario.token = usuarioSocket.token
            // }else{
            //   socket.emit("desconectarUsuario", true)
            // }
      }
    })        
    // }else{
    //   usuariosRepetidos=0
    // }

    // console.log("usuarioRepetidos-> ", usuariosRepetidos )
    if (usuariosRepetidos == 0){
      const nuevoUsuario = { id: socket.id, usuario:usuarioSocket.usuario, sesion:usuarioSocket.sesion,token:usuarioSocket.token  } 
      console.log("nuevoUsuario-> ", nuevoUsuario )
      usuariosConectados.push(nuevoUsuario)
      respuestaConexion = true
    }else{
      respuestaConexion = false
    }

    respuestaConexion? console.log("conexion aceptada") : console.log("conexion rechazada")

    socket.emit("respuestaConexion", respuestaConexion)
    
    console.log("USUARIOS CONECTADOS -> ", usuariosConectados)
    usuariosRepetidos = 0
  });

  socket.on("actualizarSocket", usuarioSocket => {
    // console.log("CONEXION SOCKET ----> ", usuarioSocket)
    
    // console.log("UsuariosConectados.length-> ", usuariosConectados.length )
    if (usuariosConectados.length != 0){    

        usuariosConectados.forEach(usuario=>{
          if(usuario.usuario == usuarioSocket.usuario){
            // usuariosRepetidos++  
            if (usuarioSocket.sesion != 0 ){
              socket.emit("matarSesion", true)
            //   usuario.id = socket.id
            //   usuario.token = usuarioSocket.token
            }else{
            //   socket.emit("desconectarUsuario", true)
            }
          }
        })        
    }else{
      usuariosRepetidos=0
    }

    // console.log("usuarioRepetidos-> ", usuariosRepetidos )
    if (usuariosRepetidos == 0){
      const nuevoUsuario = { id: socket.id, usuario:usuarioSocket.usuario, sesion:usuarioSocket.sesion,token:usuarioSocket.token  } 
      console.log("nuevoUsuario-> ", nuevoUsuario )
      usuariosConectados.push(nuevoUsuario)
      respuestaConexion = true
    }else{
      respuestaConexion = false
    }

    respuestaConexion? console.log("conexion aceptada") : console.log("conexion rechazada")

    socket.emit("respuestaConexion", respuestaConexion)
    
    console.log("USUARIOS CONECTADOS -> ", usuariosConectados)
    usuariosRepetidos = 0
  });


  socket.on("errorLogeo", usuarioEliminar=>{
    for (var i = 0; i < usuariosConectados.length; i++) {
      if (usuariosConectados[i].usuario == usuarioEliminar.usuario) {
        usuariosConectados.splice(i, 1);
        break;
      }
    }
  })
  
  socket.on("cerrarSesion", usuarioSocket =>{


    // let indexUserDisconnect = -1;

    //   const userDisconnect = usuariosConectados.find((usuarioSocket, i) => {
    //     if (usuarioSocket.id === socket.id) {
    //       indexUserDisconnect = i
    //       return true
    //     }
    //     return false
    //   })
    
    //   if (userDisconnect) {
    //     usuariosConectados.splice(indexUserDisconnect, 1);
    //     socket.emit("matarSesion", true)
    //   }


    for (var i = 0; i < usuariosConectados.length; i++) {
      if (usuariosConectados[i].usuario == usuarioSocket.usuario) {
        usuariosConectados.splice(i, 1);
      }
    }  
    
    console.log("USUARIO DESCONECTADO DESDE EL CERRAR SESION-> ", usuarioSocket)
    
    console.log("USUARIOS ACTUALES -> ", usuariosConectados)
  })
  
  socket.on("disconnect", async () => {
    // console.log("USUARIO A DESCONECTAR primero -> ", socket.id)

    console.log("USUARIO DESCONECTADO DESDE EL DISCONNECT **************************************")
    try {
      let indexUserDisconnect = -1;

      const userDisconnect = usuariosConectados.find((usuarioSocket, i) => {
        if (usuarioSocket.id === socket.id) {
          indexUserDisconnect = i
          return true
        }
        return false
      })
    
      if (userDisconnect) {
        await cerrarSesion(userDisconnect.sesion, userDisconnect.token)
        usuariosConectados.splice(indexUserDisconnect, 1);
        // console.log("USUARIODISCONNECTED -> ", userDisconnect.usuario)
        socket.emit("matarSesion", true)

      }
    } catch (e) {
      console.log("error => ", e.message)
    }
    // for (var i = 0; i < usuariosConectados.length; i++) {
    //   if (usuariosConectados[i].id == socket.id) {
    //     // cerrarSesion(usuariosConectados[i].sesion, usuariosConectados[i].token)
    //     usuariosConectados.splice(i, 1);
    //     break;
    //   }
    // }
    
    console.log("USUARIO A DESCONECTAR -> ", socket.id)
    console.log("USUARIOS ACTUALES -> ", usuariosConectados)
  })
  
})  

server.listen(PORT);
console.log(`server on port ${PORT}`);
