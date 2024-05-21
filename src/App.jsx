import { useState, useEffect, useRef } from 'react'
import useSound from 'use-sound';
import simon from './assets/sounds/sprite.mp3';
import './App.css'


function App() {


 const blueRef = useRef(null);
 const yellowRef = useRef(null);
 const greenRef = useRef(null);
 const redRef = useRef(null);
 const [play] = useSound(simon, {
   sprite: {
     one: [0, 500],
     two: [1000, 500],
     three: [2000, 500],
     four: [3000, 500],
     error: [4000, 1000]
   },
 });
 const colors = [
   {
     color:'#FAF303',
     ref: yellowRef,
     sound: 'one'
   },
   {
     color:'#030AFA',
     ref: blueRef,
     sound: 'two'
   },
   {
     color:'#FA0E03',
     ref: redRef,
     sound: 'three'
   },
   {
     color:'#0AFA03',
     ref: greenRef,
     sound: 'four'
   }
 ];
 const minNumber = 0;
 const maxNumber = 3;
 const speedGame = 400;


 const [sequence, setSequence] = useState([]);
 const [currentGame, setCurrentGame] = useState([]);
 const [highScore, setHighScore] = useState([]);
 const [lastGame, setLastGame] = useState([]);
 const [isAllowedToPlay, setIsAllowedToPlay] = useState(false)
 const [speed, setSpeed] = useState(speedGame);
 const [turn, setTurn] = useState(0);
 const [pulses, setPulses] = useState(0);
 const [success, setSuccess] = useState(0);
 const [isGameOn, setIsGameOn] = useState(false);
 const [isPlayingSequence, setIsPlayingSequence] = useState(false);


 const handleClick = (index) => {
   if(isAllowedToPlay) {
     play({id: colors[index].sound})
     colors[index].ref.current.style.opacity = (1);
     colors[index].ref.current.style.scale = (0.9);
     setTimeout(() => {
       colors[index].ref.current.style.opacity = (0.5);
       colors[index].ref.current.style.scale = (1);
       setCurrentGame([...currentGame, index]);
      
       setPulses(pulses + 1);
     }, speed / 2 )
   }
 }


 const randomNumber = () => {
   setIsAllowedToPlay(false);
   const randomNumber = Math.floor(Math.random() * (maxNumber - minNumber + 1) + minNumber);
   setSequence([...sequence, randomNumber]);
   setTurn(turn + 1);
 }


 /*PLAYING SEQUENCE*/
 const playSequence = (arraySequence) => {
   if(arraySequence.length > 0) {
     setIsPlayingSequence(true);
     arraySequence.map((item, index) => {
       setTimeout(() => {
         play({id: colors[item].sound})
         colors[item].ref.current.style.opacity = (1);
         setTimeout(() => {
           colors[item].ref.current.style.opacity = (0.5);
           if(arraySequence.length -1  === index) {
             setTimeout(() => {
               setIsPlayingSequence(false);
             }, 500);
           }
         }, speed / 2 )
       }, speed * index )  
     })
   }
  
 }


 const initGame = () => {
   randomNumber();
   setIsGameOn(true);
 }


 useEffect(() => {
   if(!isGameOn) {
     setSequence([]);
     setCurrentGame([]);
     setIsAllowedToPlay(false);
     setSpeed(speedGame);
     setSuccess(0);
     setPulses(0);
     setTurn(0);
   }
  
 }, [isGameOn])
 


 useEffect(() => {
   if(pulses > 0) {
    
     if(Number(sequence[pulses - 1]) === Number(currentGame[pulses - 1])){
       setSuccess(success + 1);      
     } else {
      
       const index = sequence[pulses -1]
       if (index) colors[index].ref.current.style.opacity = (1);
       play({id: 'error'})
       setTimeout(() => {
         if (index) colors[index].ref.current.style.opacity = (0.5);
         if(sequence.length > highScore.length) {
           setHighScore(sequence);
         }
         setLastGame(sequence)
         setIsGameOn(false);
       }, speed * 2 )
    


     setIsAllowedToPlay(false);
     }
   }
 }, [pulses])
  useEffect(() => {
   if(success === sequence.length && success > 0) {
     setSpeed(speed - sequence.length * 2);
     setTimeout(() => {
       setSuccess(0);
       setPulses(0);
       setCurrentGame([])
       randomNumber();
     }, 500);
   }
 }, [success])


 useEffect(() => {
   if(!isAllowedToPlay) {
     sequence.map((item, index) => {
       setTimeout(() => {
         play({id: colors[item].sound})
         colors[item].ref.current.style.opacity = (1);
         setTimeout(() => {
           colors[item].ref.current.style.opacity = (0.5);
         }, speed / 2 )
       }, speed * index )  
     })
   }
   setIsAllowedToPlay(true);
 }, [sequence])


 return (
   <>
   {
   isGameOn || isPlayingSequence
   ? 
   <>
   <div className='header'>
     <h1>{turn}</h1>
   </div>
     <div className='container'>
       
     {colors.map((item, index) => {
       return (
         <div
           key={index}
           ref={item.ref}
           className={`pad pad-${index}`}
           style={{backgroundColor:`${item.color}`, opacity:0.6}}
           onClick={() => handleClick(index)}
         >
         </div>
       )
     }) }
     </div>
     </>
   :
     <>
       <div className='header'>
         <h1>SUPER SIMON</h1>
       </div>
       <div className='botton-container'>
         <button onClick={initGame}>START</button>
         <button onClick={() => playSequence(highScore)}>HIGH SCORE</button>
         <button onClick={() => playSequence(lastGame)}>LAST GAME</button>
       </div>
      
     </>   
   }
   
   </>
 )
}


export default App


/*
1.- Interfaz de cartón[SOLVED]
2.- Detectar click en los componentes[SOLVED]
3.- Crear array para almacenar la secuencia del juego[SOLVED]
4.- Crear el color random para añadirlo a la secuencia [SOLVED]
4.5.- Reproducir secuencia modo FAKE
5.- Reproducir la secuencia -- HARD
   a)Iniciar color, activar color
   b)Establecer un timeout, activamos y desactivamos colores
   c)Recorrer secuencia
   f)Al finalizar la secuencia debemos saber que cambia el turno al jugador
6.- Usuario intenta reproducir secuencia
7.- Validar secuencia usuario por cada pulsación
8.- Si acierta la pulsación sigue el juego
9.- Si no acierta el juego termina ylimpiamos la secuencia del juego


OPCIONAL
-Máxima puntuación
-Sonido
-Tiempo




















*/







// import { useEffect, useState, useRef } from 'react'
// import useSound from 'use-sound'
// import simon from './assets/sounds/sprite.mp3'
// import './App.css'

// function App() {

//   const blueRef = useRef(null);
//   const yellowRef = useRef(null);
//   const greenRef = useRef(null);
//   const redRef = useRef(null);

//   const [play] = useSound(simon, {
//     sprite: {
//       one: [0, 500],
//       two: [1000, 500],
//       three: [2000, 500],
//       four: [3000, 500],
//       error: [4000, 1000]
//     },
//   });

//   const colors = [
//     {
//       color: '#FAF303',
//       ref: yellowRef,
//       sound: 'one' 
//     },
//     {
//       color: '#030AFA',
//       ref: blueRef,
//       sound: 'two' 
//     },
//     {
//       color: '#FA0E03',
//       ref: redRef,
//       sound: 'three' 
//     },
//     {
//       color: '#0AFA03',
//       ref: greenRef,
//       sound: 'four' 
//     },
//   ];

//   const minNumber = 0;
//   const maxNumber = 3;
//   const speedGame = 400;

//   const [sequence, setSequence] = useState([]);
//   const [currentGame, setCurrentGame] = useState([]);
//   const [isAllowedToPlay, setIsAllowedToPlay] = useState(false);
//   const [speed, setSpeed] = useState(speedGame);
//   const [turn, setTurn] = useState(0);
//   const [pulses, setPulses] = useState(0);
//   const [success, setSuccess] = useState(0);
//   const [isGameOn, setIsGameOn] = useState(false);

//   const [lastGame, setLastGame] = useState([]); 
//   const [saveRecord, setSaveRecord] = useState(0);
//   const [saveSequence, setSaveSequence] = useState([]);
  
//   const handleClick = (index) => {
//     if (isAllowedToPlay){
//       play({id: colors[index].sound})
//       colors[index].ref.current.style.opacity = (1);
//       colors[index].ref.current.style.scale = (0.9);
//       setTimeout(() => {
//         colors[index].ref.current.style.opacity = (0.5);
//         colors[index].ref.current.style.scale = (1);
//         setCurrentGame([...currentGame, index]);
//         setPulses(pulses + 1);
//       }, speed / 2)
//     }
//   }

//   const randomNumber = () => {
//     setIsAllowedToPlay(false);
//     const randomNumber = Math.floor(Math.random() * (maxNumber - minNumber + 1) + minNumber);
//     setSequence([...sequence, randomNumber]);
//   }
  
//     const lastPlay = (arraySequence) => {
//       if(arraySequence.length > 0) {
//         setSaveSequence(true);
//         arraySequence.map((item, index) => {
//           setTimeout(() => {
//             play({id: colors[item].sound})
//             colors[item].ref.current.style.opacity = (1);
//             setTimeout(() => {
//               colors[item].ref.current.style.opacity = (0.5);
//               if(arraySequence.length -1  === index) {
//                 setTimeout(() => {
//                   setSaveSequence(false);
//                 }, 500);
//               }
//             }, speed / 2 )
//           }, speed * index )  
//         })
//       }
     
//     }
  
//   const initGame = () => {
//     randomNumber();
//     setIsGameOn(true);
//   }
  
//   useEffect(() => {
//     if(!isGameOn){
//       setSequence([]);
//       setCurrentGame([]);
//       setIsAllowedToPlay(false);
//       setSpeed(speedGame);
//       setSuccess(0);
//       setPulses(0);
//       setTurn(0);
//     }
//   }, [isGameOn])

//   useEffect (() => {
//     if(pulses > 0){
//       if(Number(sequence[pulses - 1]) === Number(currentGame[pulses - 1])){
//         setSuccess(success + 1);
//       } else{
//         const index = sequence[pulses - 1]
//         if (index) colors[index].ref.current.style.opacity = (1);
//         play({id:'error'})
//         setTimeout(() => {
//           if (index) colors[index].ref.current.style.opacity = (0.5);
//           if(sequence.length > highScore.length) {
//             setSaveRecord(sequence);
//           } 
//           setLastGame(sequence);
//           setIsGameOn(false);
//         }, speed * 2)
//       setIsAllowedToPlay(false);  
//       }
//     }
//   }, [pulses])

//   useEffect(() => {
//     if(success === sequence.length && success > 0){
//       setSpeed(speed - sequence.length * 2);
//       setTimeout(() => {
//         setSuccess(0);
//         setPulses(0);
//         setCurrentGame([])
//         randomNumber();
//         setTurn(turn + 1);

//       }, 500);
//     }
//   }, [success])

//   useEffect(() => {
//     if(!isAllowedToPlay){
//       sequence.map((item, index) => {
//         setTimeout(() => {
//           play({id: colors[item].sound})
//           colors[item].ref.current.style.opacity = (1);
//           setTimeout(() => {
//             colors[item].ref.current.style.opacity = (0.5);
//           }, speed / 2)
//         }, speed * index )
//       })
//     }
//       setIsAllowedToPlay(true);
    
//   },[sequence])

  

// //   lastPlay(() => {useEffect(() => {
// //     if(!isGameOn){
// //       // save last  sequence
// //       // reproduce saved sequence
// //     setSaveSequence([...currentGame, saveSequence]);
      
// //     }
// //   },[isGameOn])
// //  }
// // )




//   return (
//     <>
//     {
//     isGameOn 
//     ?
//     <>
//     <div className='header'>
//       <h1>Turn {turn}</h1>
//     </div>
//     <div className='container'>
//       {colors.map((item, index) => {
//         return (
//           <div
//           key={index}
//           ref={item.ref}
//           className={`pad pad-${index}`}
//           style={{backgroundColor:`${item.color}`, opacity:0.6}}
//           onClick={() => handleClick(index)}
//           >
//           </div>
//         )
//       })}
//     </div>

//     <div className='marcadores'>
//       <label className='record'>RECORD</label>
//       <br></br>
//       <label className='record'>{saveRecord}</label>
//     </div>
//     </>
//     :
//     <>
//     <div className='header'>
//     <h1>SUPER SIMON FINAL</h1>
//     </div>
//     <button onClick={initGame}>START</button>
//     <br />
//     <br />
//     <button onClick={() => lastPlay(lastGame)}>LAST PLAY</button>
//     </>
//     }
    
//     </>
//   )
// }

// export default App;

// // Boton Record, last game