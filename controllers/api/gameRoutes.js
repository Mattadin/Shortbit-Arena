const router = require('express').Router();

//   router.post('/gamestart', withAuth, async (req, res) => {

//     try{

//       // console.log("Selected character", req.body.selectedCharacter);
//       req.session.save(()=>{
//         req.session.characterId = req.body.selectedCharacter;
//         res.status(200).json({message: "Game Starting"});
//       });

//     }
//     catch (err){
//       res.status(404).json({title:"Error", message: err});
//     }
//   });

module.exports = router;
