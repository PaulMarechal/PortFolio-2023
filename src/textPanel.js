import * as THREE from 'three';

import ThreeMeshUI from 'three-mesh-ui';
import VRControl from 'three-mesh-ui/examples/utils/VRControl.js';
import ShadowedLight from 'three-mesh-ui/examples/utils/ShadowedLight.js';

import FontJSON from 'three-mesh-ui/examples/assets/Roboto-msdf.json';
import FontImage from 'three-mesh-ui/examples/assets/Roboto-msdf.png';
// import SnakeImage from "three-mesh-ui/examples/assets/spiny_bush_viper.jpg";
import * as dat from 'lil-gui'
import * as NameRooms from "./roomInfo.js";

export function TextPanel(scene, roomNumber) {

    // //Debug
    // const gui = new dat.GUI({
    //     width: 400
    // })

    const container = new ThreeMeshUI.Block({
      ref: "container",
      padding: 0.025,
      fontFamily: FontJSON,
      fontTexture: FontImage,
      fontColor: new THREE.Color(0xffffff),
      backgroundOpacity: 0,
    });
  
    container.position.set(0, 1.3, -1.8);
    container.rotation.x = -0.5;
    scene.add(container);
  
    //
  
    const title = new ThreeMeshUI.Block({
      height: 0.2,
      width: 1.5,
      margin: 0.025,
      justifyContent: "center",
      fontSize: 0.09,
    });
  
    // Main Title
    title.add(
      new ThreeMeshUI.Text({
        content: `${NameRooms.roomInfos[roomNumber][1]}`,
      })
    );
  
    container.add(title);

    // gui.add(title.position, 'x').min(-20).max(20).step(0.01).name('Titre x')
    // gui.add(title.position, 'y').min(-20).max(20).step(0.01).name('Titre y')
    // gui.add(title.position, 'z').min(-20).max(20).step(0.01).name('Titre z')
  
    //
  
    const leftSubBlock = new ThreeMeshUI.Block({
        height: 0.95,
        width: 1.3,
        margin: 0.025,
        padding: 0.025,
        textAlign: "left",
        justifyContent: "end",
        backgroundOpacity: 0,
    });
  
    // const caption = new ThreeMeshUI.Block({
    //   height: 0.07,
    //   width: 0.37,
    //   textAlign: "center",
    //   justifyContent: "center",
    // });
  
    // caption.add(
    //   new ThreeMeshUI.Text({
    //     content: "Mind your fingers",
    //     fontSize: 0.04,
    //   })
    // );
  
    // leftSubBlock.add(caption);
  
    //
  
    const rightSubBlock = new ThreeMeshUI.Block({
      margin: 0.025,
    });

    rightSubBlock.position.set(0.83, 0.15, 0)
  
    const subSubBlock1 = new ThreeMeshUI.Block({
      height: 0.5,
      width: 0.5,
      margin: 0.01,
      padding: 0.02,
      fontSize: 0.025,
      justifyContent: "center",
      backgroundOpacity: 0,
    }).add(
      new ThreeMeshUI.Text({
        // Location
        content: `${NameRooms.roomInfos[roomNumber][3]}`,
      }),
  
      // Green text
      // new ThreeMeshUI.Text({
      //   content: "bristly",
      //   fontColor: new THREE.Color(0x92e66c),
      // }),

      // Depth
      new ThreeMeshUI.Text({
        content: `\n Depth : approximately ${NameRooms.roomInfos[roomNumber][4]} `,
      })
    );
  
    const subSubBlock2 = new ThreeMeshUI.Block({
      height: 0.35,
      width: 0.5,
      margin: 0.025,
      padding: 0.02,
      fontSize: 0.04,
      alignItems: "start",
      textAlign: 'justify',
      backgroundOpacity: 0,
    }).add(
      new ThreeMeshUI.Text({
        content:
          `${NameRooms.roomInfos[roomNumber][2]}`,
      })
    );

    // No need 
    // console.log("`${NameRooms.roomInfos[roomNumber][2]}`")
    // console.log(NameRooms.roomInfos[roomNumber][2])
  
    rightSubBlock.add(subSubBlock2, subSubBlock1);
  
    //
  
    const contentContainer = new ThreeMeshUI.Block({
      contentDirection: "row",
      padding: 0.02,
      margin: 0.05,
      backgroundOpacity: 0,
    //   justifyContent: "end",
    });
    
  
    contentContainer.add(leftSubBlock, rightSubBlock);
    // contentContainer.add(rightSubBlock);
    container.name = "boxContainer"
    container.add(contentContainer);
  
    //
  
    // new THREE.TextureLoader().load(SnakeImage, (texture) => {
    //   leftSubBlock.set({
    //     backgroundTexture: texture,
    //   });
    // });
  }