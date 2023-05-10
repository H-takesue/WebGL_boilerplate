async function loadShaderCode() {
    const vertCodeResponse = await fetch('/shader/v_shader.vert');
    const vertCode = await vertCodeResponse.text();
    const fragCodeResponse = await fetch('/shader/f_shader.frag');
    const fragCode = await fragCodeResponse.text();
    return {vertCode, fragCode};
}

loadShaderCode().then((shaderCode) => {

    const {vertCode, fragCode} = shaderCode;
// HTML要素からcanvasを取得
    const canvas = document.getElementById("webglCanvas");
// WebGLコンテキストを取得
    const gl = canvas.getContext("webgl");

// WebGLが利用できない場合のエラーメッセージ
    if (!gl) {
        alert("WebGLが利用できません。別のブラウザをお試しください。");
    }

// canvasサイズをウィンドウサイズに設定
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
// WebGLのビューポートをcanvasサイズに設定
    gl.viewport(0, 0, canvas.width, canvas.height);

// クリアカラーを黒に設定
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
// カラーバッファをクリア
    gl.clear(gl.COLOR_BUFFER_BIT);

// 頂点座標の配列
    const vertices = [
        -0.5, -0.5,
        0.5, -0.5,
        0.5, 0.5,
        -0.5, 0.5
    ];

// 頂点バッファを作成し、データを転送
    const vertex_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

// 頂点シェーダーを作成し、コードをコンパイル
    const vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, vertCode);
    gl.compileShader(vertShader);

// フラグメントシェーダーを作成し、コードをコンパイル
    const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, fragCode);
    gl.compileShader(fragShader);

// シェーダープログラムを作成し、頂点シェーダーとフラグメントシェーダーをアタッチ
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertShader);
    gl.attachShader(shaderProgram, fragShader);
// シェーダープログラムをリンクし、使用
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);

// 頂点シェーダーの"coordinates"属性の位置を取得
    const coord = gl.getAttribLocation(shaderProgram, "coordinates");
// 頂点属性を有効化し、データをバインド
    gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(coord);

// 描画を実行 (四角形を描画)
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

});
