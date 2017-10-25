import React from 'react';
import React3 from 'react-three-renderer';
import * as THREE from 'three';
import ReactDOM from 'react-dom';

const vec3 = (x, y, z) => new THREE.Vector3(x, y, z);

const groundPosition = vec3(0, 0, -1)
const piDiv180 = Math.PI / 180

class Simple extends React.Component {
  constructor(props, context) {
    super(props, context);

    // construct the position vector here, because if we use 'new' within render,
    // React will think that things have changed when they have not.
    this.cameraPosition = new THREE.Vector3(0, 0, 5);

    let alpha, beta, gamma
    this.state = {
      cubeRotation: new THREE.Euler(),
      cameraRotation: new THREE.Euler(),
    };

    this._onAnimate = () => {
      // we will get this callback every frame

      // pretend cubeRotation is immutable.
      // this helps with updates and pure rendering.
      // React will be sure that the rotation has now updated.
      this.setState({
        cubeRotation: new THREE.Euler(
          this.state.cubeRotation.x + 0.1,
          this.state.cubeRotation.y + 0.1,
          0
        ),
        // https://developer.mozilla.org/en-US/docs/Web/API/DeviceOrientationEvent
        cameraRotation: new THREE.Euler(
          beta * piDiv180, gamma * piDiv180, alpha * piDiv180
        )
      });
    };

    if (window.DeviceMotionEvent != undefined) {
      /*window.ondevicemotion = function(e) {
        // document.getElementById("accelerationX").innerHTML = e.accelerationIncludingGravity.x;
        // document.getElementById("accelerationY").innerHTML = e.accelerationIncludingGravity.y;
        // document.getElementById("accelerationZ").innerHTML = e.accelerationIncludingGravity.z;

        if ( e.rotationRate ) {

          document.getElementById("rotationAlpha").innerHTML = e.rotationRate.alpha;
          document.getElementById("rotationBeta").innerHTML = e.rotationRate.beta;
          document.getElementById("rotationGamma").innerHTML = e.rotationRate.gamma;
        }
      }*/
      window.addEventListener('deviceorientation', function(event) {
        alpha = event.alpha
        beta = event.beta
        gamma = event.gamma
      });
    }

  }

  render() {
    const width = window.innerWidth; // canvas width
    const height = window.innerHeight; // canvas height
    let {cubeRotation, cameraRotation} = this.state
    return (
      <React3
        mainCamera="camera" // this points to the perspectiveCamera which has the name set to "camera" below
        width={width}
        height={height}

        onAnimate={this._onAnimate}
      >
        <scene>
          <perspectiveCamera
            name="camera"
            fov={75}
            aspect={width / height}
            near={0.1}
            far={1000}

            rotation={cameraRotation}
            position={this.cameraPosition}
          />
          <mesh rotation={cubeRotation} >
            <boxGeometry
              width={1}
              height={1}
              depth={1}
            />
            <meshBasicMaterial color={0x00ff00} />
          </mesh>

          {/* ground plane */}
          <mesh position={groundPosition} >
            <planeGeometry
              width={10}
              height={10}
              dynamic={false}
            />
            <meshBasicMaterial
              color={0xf6f6f6}
            />
          </mesh>
        </scene>
      </React3>);
  }
}
let div = document.querySelector('.app')

ReactDOM.render(<Simple/>, div);