let scene, camera, renderer;
    let isDragging = false;
    let previousX = 0, previousY = 0;


    const planets = [];


    window.onload = function() {
      init();
      animate();
    };


    function init() {
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x050510);


      camera = new THREE.PerspectiveCamera(
        window.innerWidth < 600 ? 100 : 90, // campo de visão maior em celulares
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.set(0, 50, 100);


      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(renderer.domElement);


      const ambientLight = new THREE.AmbientLight(0x333333);
      scene.add(ambientLight);


      const pointLight = new THREE.PointLight(0xFFFFFF, 2, 0, 0);
      pointLight.position.set(0, 0, 0);
      scene.add(pointLight);


      const sunGeometry = new THREE.SphereGeometry(10, 32, 32);
      const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xFFA500 });
      const sun = new THREE.Mesh(sunGeometry, sunMaterial);
      scene.add(sun);


      function createPlanet(size, distance, color, orbitalSpeed, axialRotationSpeed) {
        const planetOrbit = new THREE.Object3D();
        scene.add(planetOrbit);


        const planetGeometry = new THREE.SphereGeometry(size, 32, 32);
        const planetMaterial = new THREE.MeshLambertMaterial({ color: color });
        const planet = new THREE.Mesh(planetGeometry, planetMaterial);
        planet.position.x = distance;


        planetOrbit.add(planet);


        planets.push({
          mesh: planet,
          orbitObject: planetOrbit,
          orbitalSpeed: orbitalSpeed,
          axialRotationSpeed: axialRotationSpeed
        });
      }


      createPlanet(0.8, 20, 0xAAAAAA, 0.02, 0.05);
      createPlanet(1.5, 30, 0xFFD700, 0.015, 0.03);
      createPlanet(1.8, 40, 0x0000FF, 0.01, 0.02);
      createPlanet(1.2, 50, 0xFF6F00, 0.008, 0.04);
      createPlanet(6, 80, 0xF4A460, 0.005, 0.01);
      createPlanet(4, 110, 0xD2B48C, 0.003, 0.008);
      createPlanet(3, 130, 0x00CDD7, 0.002, 0.004);
      createPlanet(2, 160, 0x006EDB, 0.001, 0.001);


      // Mouse
      renderer.domElement.addEventListener('mousedown', onPointerDown, false);
      renderer.domElement.addEventListener('mouseup', onPointerUp, false);
      renderer.domElement.addEventListener('mousemove', onPointerMove, false);


      // Toque (mobile)
      renderer.domElement.addEventListener('touchstart', onTouchStart, false);
      renderer.domElement.addEventListener('touchend', onTouchEnd, false);
      renderer.domElement.addEventListener('touchmove', onTouchMove, false);


      window.addEventListener('resize', onWindowResize, false);
    }


    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }


    // Controles com mouse
    function onPointerDown(event) {
      isDragging = true;
      previousX = event.clientX;
      previousY = event.clientY;
    }
    function onPointerUp() { isDragging = false; }
    function onPointerMove(event) {
      if (!isDragging) return;
      rotateCamera(event.clientX, event.clientY);
      previousX = event.clientX;
      previousY = event.clientY;
    }


    // Controles com toque
    function onTouchStart(event) {
      if (event.touches.length === 1) {
        isDragging = true;
        previousX = event.touches[0].clientX;
        previousY = event.touches[0].clientY;
      }
    }
    function onTouchEnd() { isDragging = false; }
    function onTouchMove(event) {
      if (!isDragging || event.touches.length !== 1) return;
      rotateCamera(event.touches[0].clientX, event.touches[0].clientY);
      previousX = event.touches[0].clientX;
      previousY = event.touches[0].clientY;
    }


    function rotateCamera(currentX, currentY) {
      const deltaX = currentX - previousX;
      const deltaY = currentY - previousY;


      const rotationSpeed = 0.005;
      camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), -deltaX * rotationSpeed);
      camera.position.applyAxisAngle(new THREE.Vector3(1, 0, 0), -deltaY * rotationSpeed);
      camera.lookAt(0, 0, 0);
    }


    function animate() {
      requestAnimationFrame(animate);


      planets.forEach(planet => {
        planet.orbitObject.rotation.y += planet.orbitalSpeed;
        planet.mesh.rotation.y += planet.axialRotationSpeed;
      });


      renderer.render(scene, camera);
    }