'use strict';

angular.module('angularFullstackApp')
  .controller('WebglCtrl', function ($scope) {

    var gl;
    var canvas;
    var shaderProgram;
    var floorVertexPositionBuffer;
    var floorVertexIndexBuffer;
    var cubeVertexPositionBuffer;
    var cubeVertexIndexBuffer;

    var modelViewMatrix;
    var projectionMatrix;
    var modelViewMatrixStack;

    function createGLContext(canvas) {
      var names = ["webgl", "experimental-webgl"];
      var context = null;
      for (var i=0; i < names.length; i++) {
        try {
          context = canvas.getContext(names[i]);
        } catch(e) {}
        if (context) {
          break;
        }
      }
      if (context) {
        context.viewportWidth = canvas.width;
        context.viewportHeight = canvas.height;
      } else {
        alert("Failed to create WebGL context!");
      }
      return context;
    }
    function loadShaderFromDOM(id) {
      var shaderScript = document.getElementById(id);

      // If we don't find an element with the specified id
      // we do an early exit
      if (!shaderScript) {
        return null;
      }

      // Loop through the children for the found DOM element and
      // build up the shader source code as a string
      var shaderSource = "";
      var currentChild = shaderScript.firstChild;
      while (currentChild) {
        if (currentChild.nodeType == 3) { // 3 corresponds to TEXT_NODE
          shaderSource += currentChild.textContent;
        }
        currentChild = currentChild.nextSibling;
      }

      var shader;
      if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
      } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
      } else {
        return null;
      }

      gl.shaderSource(shader, shaderSource);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
      }
      return shader;
    }

    function setupShaders() {
      var vertexShader = loadShaderFromDOM("shader-vs");
      var fragmentShader = loadShaderFromDOM("shader-fs");

      shaderProgram = gl.createProgram();
      gl.attachShader(shaderProgram, vertexShader);
      gl.attachShader(shaderProgram, fragmentShader);
      gl.linkProgram(shaderProgram);

      if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Failed to setup shaders");
      }

      gl.useProgram(shaderProgram);

      shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
      shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
      shaderProgram.uniformMVMatrix = gl.getUniformLocation(shaderProgram, "uMVMatrix");
      shaderProgram.uniformProjMatrix = gl.getUniformLocation(shaderProgram, "uPMatrix");

      gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

      modelViewMatrix = mat4.create();
      projectionMatrix = mat4.create();
      modelViewMatrixStack = [];
    }

    function pushModelViewMatrix() {
      var copyToPush = mat4.clone(modelViewMatrix);
      console.log(copyToPush);
      modelViewMatrixStack.push(copyToPush);
    }

    function popModelViewMatrix() {
      if (modelViewMatrixStack.length == 0) {
        throw "Error popModelViewMatrix() - Stack was empty ";
      }
      modelViewMatrix = modelViewMatrixStack.pop();
      console.log(modelViewMatrix);
    }

    function setupFloorBuffers() {
      floorVertexPositionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, floorVertexPositionBuffer);

      var floorVertexPosition = [
        // Plane in y=0
        5.0,   0.0,  5.0,  //v0
        5.0,   0.0, -5.0,  //v1
        -5.0,   0.0, -5.0,  //v2
        -5.0,   0.0,  5.0]; //v3

      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(floorVertexPosition),
        gl.STATIC_DRAW);

      floorVertexPositionBuffer.itemSize = 3;
      floorVertexPositionBuffer.numberOfItems = 4;

      floorVertexIndexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, floorVertexIndexBuffer);
      var floorVertexIndices = [0, 1, 2, 3];

      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(floorVertexIndices),
        gl.STATIC_DRAW);
      floorVertexIndexBuffer.itemSize = 1;
      floorVertexIndexBuffer.numberOfItems = 4;
    }

    function setupCubeBuffers() {
      cubeVertexPositionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);

      var cubeVertexPosition = [
        // Front face
        1.0,  1.0,  1.0, //v0
        -1.0,  1.0,  1.0, //v1
        -1.0, -1.0,  1.0, //v2
        1.0, -1.0,  1.0, //v3

        // Back face
        1.0,  1.0, -1.0, //v4
        -1.0,  1.0, -1.0, //v5
        -1.0, -1.0, -1.0, //v6
        1.0, -1.0, -1.0, //v7

        // Left face
        -1.0,  1.0,  1.0, //v8
        -1.0,  1.0, -1.0, //v9
        -1.0, -1.0, -1.0, //v10
        -1.0, -1.0,  1.0, //v11

        // Right face
        1.0,  1.0,  1.0, //12
        1.0, -1.0,  1.0, //13
        1.0, -1.0, -1.0, //14
        1.0,  1.0, -1.0, //15

        // Top face
        1.0,  1.0,  1.0, //v16
        1.0,  1.0, -1.0, //v17
        -1.0,  1.0, -1.0, //v18
        -1.0,  1.0,  1.0, //v19

        // Bottom face
        1.0, -1.0,  1.0, //v20
        1.0, -1.0, -1.0, //v21
        -1.0, -1.0, -1.0, //v22
        -1.0, -1.0,  1.0 //v23
      ];

      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeVertexPosition),
        gl.STATIC_DRAW);
      cubeVertexPositionBuffer.itemSize = 3;
      cubeVertexPositionBuffer.numberOfItems = 24;

      cubeVertexIndexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
      var cubeVertexIndices = [
        0, 1, 2,      0, 2, 3,    // Front face
        4, 6, 5,      4, 7, 6,    // Back face
        8, 9, 10,     8, 10, 11,  // Left face
        12, 13, 14,   12, 14, 15, // Right face
        16, 17, 18,   16, 18, 19, // Top face
        20, 22, 21,   20, 23, 22  // Bottom face
      ];
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices),
        gl.STATIC_DRAW);
      cubeVertexIndexBuffer.itemSize = 1;
      cubeVertexIndexBuffer.numberOfItems = 36;
    }

    function setupBuffers() {
      setupFloorBuffers();
      setupCubeBuffers();
    }

    function uploadModelViewMatrixToShader() {
      gl.uniformMatrix4fv(shaderProgram.uniformMVMatrix, false, modelViewMatrix);
    }

    function uploadProjectionMatrixToShader() {
      gl.uniformMatrix4fv(shaderProgram.uniformProjMatrix,
        false, projectionMatrix);
    }

    function drawFloor(r,g,b,a) {
      // Disable vertex attrib array and use constant color for the floor.
      gl.disableVertexAttribArray(shaderProgram.vertexColorAttribute);
      // Set color
      gl.vertexAttrib4f(shaderProgram.vertexColorAttribute, r, g, b, a);

      // Draw the floor
      gl.bindBuffer(gl.ARRAY_BUFFER, floorVertexPositionBuffer);
      gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
        floorVertexPositionBuffer.itemSize,
        gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, floorVertexIndexBuffer);
      gl.drawElements(gl.TRIANGLE_FAN, floorVertexIndexBuffer.numberOfItems,
        gl.UNSIGNED_SHORT, 0);
    }

    function drawCube(r,g,b,a) {
      // Disable vertex attrib array and use constant color for the cube.
      gl.disableVertexAttribArray(shaderProgram.vertexColorAttribute);
      // Set color
      gl.vertexAttrib4f(shaderProgram.vertexColorAttribute, r, g, b, a);

      gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
      gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
        cubeVertexPositionBuffer.itemSize,
        gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);

      gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numberOfItems,
        gl.UNSIGNED_SHORT, 0);

    }

    function drawTable(){
      // Draw table top
      var trans = vec3.fromValues(0, 1, 0);
      var scale = vec3.fromValues(2,0.1,2.0);

      pushModelViewMatrix();
      mat4.translate(modelViewMatrix, modelViewMatrix,trans);
      mat4.scale(modelViewMatrix, modelViewMatrix,scale);
      uploadModelViewMatrixToShader();
      // Draw the actual cube (now scaled to a cuboid) in brown color
      drawCube(0.72, 0.53, 0.04, 1.0); // arguments set brown color
      popModelViewMatrix();

      // Draw table legs
      for (var i=-1; i<=1; i+=2) {
        for (var j= -1; j<=1; j+=2) {
          pushModelViewMatrix();
          vec3.set(trans,i*1.9, -0.1, j*1.9);
          mat4.translate(modelViewMatrix, modelViewMatrix,trans);
          vec3.set(scale,0.1, 1.0, 0.1);
          mat4.scale(modelViewMatrix, modelViewMatrix,scale);
          uploadModelViewMatrixToShader();
          drawCube(0.72, 0.53, 0.04, 1.0); // argument sets brown color
          popModelViewMatrix();
        }
      }
    }

    function draw() {
      gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      mat4.perspective(projectionMatrix,Math.PI/3, gl.viewportWidth / gl.viewportHeight,
        0.1, 100.0);

      mat4.identity(modelViewMatrix);

      var eye = vec3.fromValues(8, 5, -10);
      var center = vec3.fromValues(0, 0, 0);
      var up = vec3.fromValues(0,1,0);


      mat4.lookAt(modelViewMatrix, eye, center, up);

      uploadModelViewMatrixToShader();
      uploadProjectionMatrixToShader();

      // Draw floor in red color
      drawFloor(1.0, 0.0, 0.0, 1.0);

      // Draw table
      var trans = vec3.fromValues(0.0, 1.1, 0.0);
      pushModelViewMatrix();
      mat4.translate(modelViewMatrix, modelViewMatrix,trans);
      uploadModelViewMatrixToShader();
      drawTable();
      popModelViewMatrix();

      // Draw box on top of the table
      pushModelViewMatrix();
      vec3.set(trans,0.0, 2.7 ,0.0);
      var scale = vec3.fromValues(0.5, 0.5, 0.5);
      mat4.translate(modelViewMatrix, modelViewMatrix,trans);
      mat4.scale(modelViewMatrix,modelViewMatrix,scale);
      uploadModelViewMatrixToShader();
      drawCube(0.0, 0.0, 1.0, 1.0);
      popModelViewMatrix();
    }

    function startup() {
      canvas = document.getElementById("myGLCanvas");
      gl = createGLContext(canvas);
      setupShaders();
      setupBuffers();
      gl.clearColor(1.0, 1.0, 1.0, 1.0);
      gl.enable(gl.DEPTH_TEST);
      draw();
    }

    //
    //
    //var gl;
    //var canvas;
    //var shaderProgram;
    //var triangleVertexBuffer;
    //var hexagonVertexBuffer;
    //var stripVertexBuffer;
    //var stripElementBuffer;
    //
    //var cubeVertexPositionBuffer;
    //var cubeVertexIndexBuffer;
    //var modelViewMatrix = mat4.create();
    //var projectionViewMatrix = mat4.create();
    //
    //
    //
    //
    //
    //function createGLContext(canvas) {
    //  var names= ["webgl", "experimental-webgl"];
    //  var context = null;
    //  for(var i=0; i < names.length; i++) {
    //    try {
    //      context = canvas.getContext(names[i]);
    //    } catch (e) {}
    //    if (context) {
    //      break;
    //    }
    //  }
    //  if (context) {
    //    context.viewportWidth = canvas.width;
    //    context.viewportHeight = canvas.height;
    //  } else {
    //    alert("Failed to create WebGL context!");
    //  }
    //  return context;
    //}
    //
    //function loadShader(type, shaderSource) {
    // var shader = gl.createShader(type);
    //  gl.shaderSource(shader,shaderSource);
    //  gl.compileShader(shader);
    //
    //  if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    //    alert("Error compiling shader" + gl.getShaderInfoLog(shader));
    //    gl.deleteShader(shader);
    //    return null;
    //  }
    //  return shader;
    //}
    //
    //function loadShaderFromDom(id) {
    //  var shaderScript = document.getElementById(id);
    //  if (!shaderScript) {
    //    return null;
    //  }
    //  var shaderSource = "";
    //  var currentChild = shaderScript.firstChild;
    //  while (currentChild) {
    //    if (currentChild.nodeType == 3) {
    //      shaderSource += currentChild.textContent;
    //    }
    //    currentChild = currentChild.nextSibling;
    //  }
    //
    //  var shader;
    //  if (shaderScript.type == "x-shader/x-fragment") {
    //    shader = gl.createShader(gl.FRAGMENT_SHADER);
    //  } else if ( shaderScript.type == "x-shader/x-vertex") {
    //    shader = gl.createShader(gl.VERTEX_SHADER);
    //  } else {
    //    return null;
    //  }
    //
    //  gl.shaderSource(shader, shaderSource);
    //  gl.compileShader(shader);
    //
    //  if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    //    alert(gl.getshaderInfoLog(shader));
    //    return null;
    //  }
    //  return shader;
    //}
    //
    //function setupShaders() {
    //  var vertexShader = loadShaderFromDom("shader-vs");
    //  var fragmentShader = loadShaderFromDom("shader-fs");
    //
    //  shaderProgram = gl.createProgram();
    //  gl.attachShader(shaderProgram, vertexShader);
    //  gl.attachShader(shaderProgram, fragmentShader);
    //  gl.linkProgram(shaderProgram);
    //
    //  if(!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    //    alert("Failed to setup shaders");
    //  }
    //
    //  gl.useProgram(shaderProgram);
    //
    //  shaderProgram.vertexPositionAttribute =
    //    gl.getAttribLocation(shaderProgram, "aVertexPosition");
    //
    //  shaderProgram.vertexColorAttribute =
    //    gl.getAttribLocation(shaderProgram,"aVertexColor");
    //
    //  //좌표와 색상 애트리뷰트에 사용될 버텍스 애트리뷰트 배열을 활성화한다.
    //  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
    //  gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
    //}
    //
    //function setupBuffers() {
    //
    //  //큐브
    //  cubeVertexPositionBuffer = gl.createBuffer();
    //  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
    //
    //  var cubeVertexPosition = [
    //    // Front face
    //    -1.0, -1.0,  1.0,
    //    1.0, -1.0,  1.0,
    //    1.0,  1.0,  1.0,
    //    -1.0,  1.0,  1.0,
    //
    //    // Back face
    //    -1.0, -1.0, -1.0,
    //    -1.0,  1.0, -1.0,
    //    1.0,  1.0, -1.0,
    //    1.0, -1.0, -1.0,
    //
    //    // Top face
    //    -1.0,  1.0, -1.0,
    //    -1.0,  1.0,  1.0,
    //    1.0,  1.0,  1.0,
    //    1.0,  1.0, -1.0,
    //
    //    // Bottom face
    //    -1.0, -1.0, -1.0,
    //    1.0, -1.0, -1.0,
    //    1.0, -1.0,  1.0,
    //    -1.0, -1.0,  1.0,
    //
    //    // Right face
    //    1.0, -1.0, -1.0,
    //    1.0,  1.0, -1.0,
    //    1.0,  1.0,  1.0,
    //    1.0, -1.0,  1.0,
    //
    //    // Left face
    //    -1.0, -1.0, -1.0,
    //    -1.0, -1.0,  1.0,
    //    -1.0,  1.0,  1.0,
    //    -1.0,  1.0, -1.0
    //  ];
    //
    //  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeVertexPosition),gl.STATIC_DRAW);
    //  cubeVertexPositionBuffer.itemsize = 3;
    //  cubeVertexPositionBuffer.numberOfItems = 24;
    //
    //  cubeVertexIndexBuffer = gl.createBuffer();
    //  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
    //  var cubeVertexIndices = [
    //    0,  1,  2,      0,  2,  3,    // front
    //    4,  5,  6,      4,  6,  7,    // back
    //    8,  9,  10,     8,  10, 11,   // top
    //    12, 13, 14,     12, 14, 15,   // bottom
    //    16, 17, 18,     16, 18, 19,   // right
    //    20, 21, 22,     20, 22, 23    // left
    //  ];
    //
    //  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices),gl.STATIC_DRAW);
    //  cubeVertexIndexBuffer.itemsize = 1;
    //  cubeVertexIndexBuffer.numberOfItems = 36;
    //
    //
    //  //육각형
    //  hexagonVertexBuffer = gl.createBuffer();
    //  gl.bindBuffer(gl.ARRAY_BUFFER, hexagonVertexBuffer);
    //  var hexagonVertices = [
    //    -0.3, 0.6, 0.0, //v0
    //    -0.4, 0.8, 0.0, //v1
    //    -0.6, 0.8, 0.0, //v2
    //    -0.7, 0.6, 0.0, //v3
    //    -0.6, 0.4, 0.0, //v4
    //    -0.4, 0.4, 0.0, //v5
    //    -0.3, 0.6, 0.0 //v6
    //  ];
    //
    //  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(hexagonVertices), gl.STATIC_DRAW);
    //  hexagonVertexBuffer.itemsize = 3;
    //  hexagonVertexBuffer.numberOfItems = 7;
    //
    //  //삼각형
    //  triangleVertexBuffer = gl.createBuffer();
    //  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBuffer);
    //  var triangleVertices = [
    //    //(x y z) (r g b a)
    //    0.3, 0.4, 0.0, 255, 0, 0, 255, //v0
    //    0.7, 0.4, 0.0, 0, 250, 6, 255, //v1
    //    0.5, 0.8, 0.0, 0, 0, 255, 255 //v2
    //  ];
    //
    //  var nbrOfVertices = 3;
    //  // (x,y,z) + (r,g,b,a) 를 포함하는 하나의 버텍스 요소에 필요한 바이트 계산
    //  var vertexSizeInBytes = 3*Float32Array.BYTES_PER_ELEMENT +
    //      4 * Uint8Array.BYTES_PER_ELEMENT;
    //
    //  var vertexSizeInFloats = vertexSizeInBytes / Float32Array.BYTES_PER_ELEMENT;
    //
    //  // 버퍼할당
    //  var buffer = new ArrayBuffer(nbrOfVertices * vertexSizeInBytes);
    //
    //  //좌표 정보 접근을 위한 Float32Array 뷰를 버퍼에 메핑
    //  var positionView = new Float32Array(buffer);
    //
    //  //색상 정보 접근을 위한 Uint8Array 뷰를 버퍼에 매핑
    //  var colorView = new Uint8Array(buffer);
    //
    //  //js 배열을 Arraybuffer에 복사한다.
    //  var positionOffsetInFloats = 0;
    //  var colorOffsetInBytes = 12;
    //  var k = 0;
    //  for(var i =0; i < nbrOfVertices; i++) {
    //
    //    positionView[positionOffsetInFloats] = triangleVertices[k]; // x
    //    positionView[1+positionOffsetInFloats] = triangleVertices[k+1]; //y
    //    positionView[2+positionOffsetInFloats] = triangleVertices[k+2]; //z
    //
    //    colorView[colorOffsetInBytes] = triangleVertices[k+3]; // r
    //    colorView[1+colorOffsetInBytes] = triangleVertices[k+4]; // g
    //    colorView[2+colorOffsetInBytes] = triangleVertices[k+5]; // b
    //    colorView[3+colorOffsetInBytes] = triangleVertices[k+6]; // a
    //
    //    positionOffsetInFloats += vertexSizeInFloats;
    //    colorOffsetInBytes += vertexSizeInBytes;
    //    k += 7;
    //  }
    //  gl.bufferData(gl.ARRAY_BUFFER, buffer, gl.STATIC_DRAW);
    //  triangleVertexBuffer.positionSize = 3;
    //  triangleVertexBuffer.colorSize = 4;
    //  triangleVertexBuffer.numberOfItems = 3;
    //
    //
    //  stripVertexBuffer = gl.createBuffer();
    //  gl.bindBuffer(gl.ARRAY_BUFFER, stripVertexBuffer);
    //  var stripVertices = [
    //    -0.5,0.2,0.0,
    //    -0.4,0.0,0.0,
    //    -0.3,0.2,0.0,
    //    -0.2,0.0,0.0,
    //    -0.1,0.2,0.0,
    //    0.0,0.0,0.0,
    //    0.1,0.2,0.0,
    //    0.2,0.0,0.0,
    //    0.3,0.2,0.0,
    //    0.4,0.0,0.0,
    //    0.5,0.2,0.0,
    //
    //    -0.5,-0.3,0.0,
    //    -0.4,-0.5,0.0,
    //    -0.3,-0.3,0.0,
    //    -0.2,-0.5,0.0,
    //    -0.1,-0.3,0.0,
    //    0.0,-0.5,0.0,
    //    0.1,-0.3,0.0,
    //    0.2,-0.5,0.0,
    //    0.3,-0.3,0.0,
    //    0.4,-0.5,0.0,
    //    0.5,-0.3,0.0
    //  ];
    //
    //  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(stripVertices), gl.STATIC_DRAW);
    //  stripVertexBuffer.itemsize = 3;
    //  stripVertexBuffer.numberOfItem = 22;
    //
    //  stripElementBuffer = gl.createBuffer();
    //  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,stripElementBuffer);
    //  var indices = [0,1,2,3,4,5,6,7,8,9,10,
    //  10,10,11, //겹침 인덱스
    //  11,12,13,14,15,16,17,18,19,20,21];
    //  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    //  stripElementBuffer.numberOfItems=25;
    //}
    //
    //function draw() {
    //  gl.viewport(0,0, gl.viewportWidth, gl.viewportHeight);
    //  gl.clear(gl.COLOR_BUFFER_BIT);
    //
    //
    //  //6각형 그리기
    //  // 상수 색상값이 고정 -> 버텍스 애트리뷰트 배열을 비활성화
    //  gl.disableVertexAttribArray(shaderProgram.vertexColorAttribute);
    //  gl.vertexAttrib4f(shaderProgram.vertexColorAttribute, 0.0,0.0,0.0,1.0);
    //
    //  gl.bindBuffer(gl.ARRAY_BUFFER, hexagonVertexBuffer);
    //  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
    //  hexagonVertexBuffer.itemsize, gl.FLOAT, false, 0,0);
    //
    //  gl.drawArrays(gl.LINE_STRIP, 0, hexagonVertexBuffer.numberOfItems);
    //
    //
    //  //삼각형 그리기
    //  // 색상을 사용할 것이므로 버텍스 애트리뷰트 배열을 활성화
    //  gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
    //
    //  // 좌표, 색상 정보 담는 버퍼 바인딩
    //  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBuffer);
    //
    //  // 버텍스 배열의 좌표 정보의 구성 방법을 지정한다.
    //  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
    //    triangleVertexBuffer.positionSize, gl.FLOAT, false, 16, 0);
    //
    //  gl.vertexAttribPointer(shaderProgram.vertexColorAttribute,
    //    triangleVertexBuffer.colorSize, gl.UNSIGNED_BYTE, true, 16, 12);
    //
    //  gl.drawArrays(gl.TRIANGLES, 0, triangleVertexBuffer.numberOfItems);
    //
    //  // 삼각형 스트립을 그린다.
    //  // vertexColorAttribute를 비활성화하고, 상수 색상 값을 사용한다.
    //
    //  gl.disableVertexAttribArray(shaderProgram.vertexColorAttribute);
    //
    //  gl.bindBuffer(gl.ARRAY_BUFFER, stripVertexBuffer);
    //  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
    //  stripVertexBuffer.itemsize, gl.FLOAT, false, 0,0);
    //
    //  gl.vertexAttrib4f(shaderProgram.vertexColorAttribute,1.0,1.0,0.0,1.0);
    //  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, stripElementBuffer);
    //
    //  gl.drawElements(gl.TRIANGLE_STRIP, stripElementBuffer.numberOfItems, gl.UNSIGNED_SHORT, 0);
    //
    //  // 도움선을 그려 삼각형 구분하기
    //  gl.vertexAttrib4f(shaderProgram.vertexColorAttribute, 0.0,0.0,0.0,1.0);
    //  gl.drawArrays(gl.LINE_STRIP,0,11);
    //  gl.drawArrays(gl.LINE_STRIP,11,11);
    //
    //}
    //
    //function startup() {
    //  canvas = document.getElementById("myGLCanvas");
    //  gl = createGLContext(canvas);
    //  setupShaders();
    //  setupBuffers();
    //  gl.clearColor(1.0,1.0,1.0,1.0);
    //
    //  gl.frontFace(gl.CCW);
    //  gl.enable(gl.CULL_FACE);
    //  gl.cullFace(gl.BACK);
    //  draw();
    //}

    $scope.message = 'Hello';
    $scope.startup = startup;
  });
