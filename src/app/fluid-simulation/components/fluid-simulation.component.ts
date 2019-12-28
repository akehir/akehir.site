import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  Inject, NgZone,
} from '@angular/core';

import { DOCUMENT } from '@angular/common';

import {
  Context,
  Material,
  Program,
  getWebGLContext,
  PointerPrototype,
  advectionShader,
  baseVertexShader,
  bloomBlurShader,
  bloomFinalShader,
  bloomPrefilterShader,
  blurShader,
  blurVertexShader,
  checkerboardShader,
  clearShader,
  colorShader,
  copyShader,
  curlShader,
  divergenceShader,
  gradientSubtractShader,
  pressureShader,
  splatShader,
  sunraysMaskShader,
  sunraysShader,
  vorticityShader,
  createFBO,
  createDoubleFBO,
  resizeDoubleFBO,
  createTextureAsync,
  blit,
  correctRadius,
  getResolution,
  framebufferToTexture,
  normalizeTexture,
  textureToCanvas,
  downloadURI,
  generateColor,
  getTextureScale,
  normalizeColor,
  wrap,
  scaleByPixelRatio,
  updatePointerUpData,
  updatePointerMoveData,
  updatePointerDownData,
  isMobile,
} from '../common';

/*
MIT License

Copyright (c) 2017 Pavel Dobryakov (Original WebGL Fluid Simulation Program)
Copyright (c) 2020 Raphael Ochsenbein (Angular / Typescript adaptation)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

@Component({
  // tslint:disable
  selector: 'webgl-fluid-simulation',
  // tslint:enable
  templateUrl: './fluid-simulation.component.html',
  styleUrls: ['./fluid-simulation.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FluidSimulationComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas') canvasRef: ElementRef;

  private canvas: HTMLCanvasElement;

  // WebGL Fluid Animation
  private pointers = [];
  private splatStack = [];

  private lastUpdateTime = Date.now();
  private colorUpdateTimer = 0.0;

  // context
  private gl: Context | null;
  private ext;

  // blit
  private blit;

  private dye;
  private velocity;
  private divergence;
  private curl;
  private pressure;
  private bloom;
  private bloomFramebuffers = [];
  private sunrays;
  private sunraysTemp;

  private ditheringTexture;

  private blurProgram            : Program;
  private copyProgram            : Program;
  private clearProgram           : Program;
  private colorProgram           : Program;
  private checkerboardProgram    : Program;
  private bloomPrefilterProgram  : Program;
  private bloomBlurProgram       : Program;
  private bloomFinalProgram      : Program;
  private sunraysMaskProgram     : Program;
  private sunraysProgram         : Program;
  private splatProgram           : Program;
  private advectionProgram       : Program;
  private divergenceProgram      : Program;
  private curlProgram            : Program;
  private vorticityProgram       : Program;
  private pressureProgram        : Program;
  private gradienSubtractProgram : Program;

  private displayMaterial        : Material;

  config = {
    SIM_RESOLUTION: 128,
    DYE_RESOLUTION: 1024,
    CAPTURE_RESOLUTION: 512,
    DENSITY_DISSIPATION: 1,
    VELOCITY_DISSIPATION: 0.2,
    PRESSURE: 0.8,
    PRESSURE_ITERATIONS: 20,
    CURL: 30,
    SPLAT_RADIUS: 0.25,
    SPLAT_FORCE: 6000,
    SHADING: true,
    COLORFUL: true,
    COLOR_UPDATE_SPEED: 10,
    PAUSED: false,
    BACK_COLOR: { r: 0, g: 0, b: 0 },
    TRANSPARENT: false,
    BLOOM: true,
    BLOOM_ITERATIONS: 8,
    BLOOM_RESOLUTION: 256,
    BLOOM_INTENSITY: 0.8,
    BLOOM_THRESHOLD: 0.6,
    BLOOM_SOFT_KNEE: 0.7,
    SUNRAYS: true,
    SUNRAYS_RESOLUTION: 196,
    SUNRAYS_WEIGHT: 1.0,
  };

  constructor(
    private zone: NgZone,
    @Inject(DOCUMENT) private document: Document,
    // todo: inject config
    ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // WebGL Fluid Animation
    this.canvas = this.canvasRef.nativeElement;
    this.resizeCanvas(this.canvas);

    if(!(this.canvas instanceof HTMLCanvasElement)) {
      // in case the canvas is not what's expected, we have a problem
      throw new Error();
    }

    let ctx = getWebGLContext(this.canvas);
    this.gl = ctx.gl;
    this.ext = ctx.ext;

    if (isMobile()) {
      this.config.DYE_RESOLUTION = 512;
    }

    if (!ctx.ext.supportLinearFiltering) {
      this.config.DYE_RESOLUTION = 512;
      this.config.SHADING = false;
      this.config.BLOOM = false;
      this.config.SUNRAYS = false;
    }

    this.blit = blit(ctx.gl);

    this.pointers.push(new PointerPrototype());
    this.ditheringTexture = createTextureAsync(ctx.gl,'assets/LDR_LLL1_0.png');

    this.blurProgram            = new Program(ctx.gl, blurVertexShader, blurShader);
    this.copyProgram            = new Program(ctx.gl, baseVertexShader, copyShader);
    this.clearProgram           = new Program(ctx.gl, baseVertexShader, clearShader);
    this.colorProgram           = new Program(ctx.gl, baseVertexShader, colorShader);
    this.checkerboardProgram    = new Program(ctx.gl, baseVertexShader, checkerboardShader);
    this.bloomPrefilterProgram  = new Program(ctx.gl, baseVertexShader, bloomPrefilterShader);
    this.bloomBlurProgram       = new Program(ctx.gl, baseVertexShader, bloomBlurShader);
    this.bloomFinalProgram      = new Program(ctx.gl, baseVertexShader, bloomFinalShader);
    this.sunraysMaskProgram     = new Program(ctx.gl, baseVertexShader, sunraysMaskShader);
    this.sunraysProgram         = new Program(ctx.gl, baseVertexShader, sunraysShader);
    this.splatProgram           = new Program(ctx.gl, baseVertexShader, splatShader);
    this.advectionProgram       = new Program(ctx.gl, baseVertexShader, advectionShader, this.ext);
    this.divergenceProgram      = new Program(ctx.gl, baseVertexShader, divergenceShader);
    this.curlProgram            = new Program(ctx.gl, baseVertexShader, curlShader);
    this.vorticityProgram       = new Program(ctx.gl, baseVertexShader, vorticityShader);
    this.pressureProgram        = new Program(ctx.gl, baseVertexShader, pressureShader);
    this.gradienSubtractProgram = new Program(ctx.gl, baseVertexShader, gradientSubtractShader);

    this.displayMaterial = new Material(ctx.gl, baseVertexShader);

    // todo: draw or do things by drawing.
    this.zone.runOutsideAngular(() => {
      this.updateKeywords();
      this.initFramebuffers();
      this.multipleSplats(Math.floor(Math.random() * 20) + 5);

      this.lastUpdateTime = Date.now();
      this.colorUpdateTimer = 0.0;
      this.update();

      this.canvas.addEventListener('mousedown', e => {
        let posX = scaleByPixelRatio(e.offsetX);
        let posY = scaleByPixelRatio(e.offsetY);
        let pointer = this.pointers.find(p => p.id == -1);
        if (pointer == null)
          pointer = new PointerPrototype();
        updatePointerDownData(this.canvas, pointer, -1, posX, posY);
      });

      this.canvas.addEventListener('mousemove', e => {
        let pointer = this.pointers[0];
        if (!pointer.down) return;
        let posX = scaleByPixelRatio(e.offsetX);
        let posY = scaleByPixelRatio(e.offsetY);
        updatePointerMoveData(this.canvas, pointer, posX, posY);
      });

      window.addEventListener('mouseup', () => {
        updatePointerUpData(this.pointers[0]);
      });

      this.canvas.addEventListener('touchstart', e => {
        e.preventDefault();
        const touches = e.targetTouches;
        while (touches.length >= this.pointers.length)
          this.pointers.push(new PointerPrototype());
        for (let i = 0; i < touches.length; i++) {
          let posX = scaleByPixelRatio(touches[i].pageX);
          let posY = scaleByPixelRatio(touches[i].pageY);
          updatePointerDownData(this.canvas, this.pointers[i + 1], touches[i].identifier, posX, posY);
        }
      });

      this.canvas.addEventListener('touchmove', e => {
        e.preventDefault();
        const touches = e.targetTouches;
        for (let i = 0; i < touches.length; i++) {
          let pointer = this.pointers[i + 1];
          if (!pointer.down) continue;
          let posX = scaleByPixelRatio(touches[i].pageX);
          let posY = scaleByPixelRatio(touches[i].pageY);
          updatePointerMoveData(this.canvas, pointer, posX, posY);
        }
      }, false);

      window.addEventListener('touchend', e => {
        const touches = e.changedTouches;
        for (let i = 0; i < touches.length; i++)
        {
          let pointer = this.pointers.find(p => p.id == touches[i].identifier);
          if (pointer == null) continue;
          updatePointerUpData(pointer);
        }
      });

      window.addEventListener('keydown', e => {
        if (e.code === 'KeyP')
          this.config.PAUSED = !this.config.PAUSED;
        if (e.key === ' ')
          this.splatStack.push(Math.floor(Math.random() * 20) + 5);
      });

      this.addRandomPoints();

    });
  }

  initFramebuffers () {
    let simRes = getResolution(this.gl, this.config.SIM_RESOLUTION);
    let dyeRes = getResolution(this.gl, this.config.DYE_RESOLUTION);

    const texType = this.ext.halfFloatTexType;
    const rgba    = this.ext.formatRGBA;
    const rg      = this.ext.formatRG;
    const r       = this.ext.formatR;
    const filtering = this.ext.supportLinearFiltering ? this.gl.LINEAR : this.gl.NEAREST;

    if (this.dye == null) {
      this.dye = createDoubleFBO(this.gl, dyeRes.width, dyeRes.height, rgba.internalFormat, rgba.format, texType, filtering);
    } else {
      this.dye = resizeDoubleFBO(this.gl, this.blit, this.copyProgram, this.dye, dyeRes.width, dyeRes.height, rgba.internalFormat, rgba.format, texType, filtering);
    }

    if (this.velocity == null) {
      this.velocity = createDoubleFBO(this.gl, simRes.width, simRes.height, rg.internalFormat, rg.format, texType, filtering);
    } else {
      this.velocity = resizeDoubleFBO(this.gl, this.blit, this.copyProgram, this.velocity, simRes.width, simRes.height, rg.internalFormat, rg.format, texType, filtering);
    }

    this.divergence = createFBO      (this.gl, simRes.width, simRes.height, r.internalFormat, r.format, texType, this.gl.NEAREST);
    this.curl       = createFBO      (this.gl, simRes.width, simRes.height, r.internalFormat, r.format, texType, this.gl.NEAREST);
    this.pressure   = createDoubleFBO(this.gl, simRes.width, simRes.height, r.internalFormat, r.format, texType, this.gl.NEAREST);

    this.initBloomFramebuffers();
    this.initSunraysFramebuffers();
  }

  initBloomFramebuffers () {
    let res = getResolution(this.gl, this.config.BLOOM_RESOLUTION);

    const texType = this.ext.halfFloatTexType;
    const rgba = this.ext.formatRGBA;
    const filtering = this.ext.supportLinearFiltering ? this.gl.LINEAR : this.gl.NEAREST;

    this.bloom = createFBO(this.gl, res.width, res.height, rgba.internalFormat, rgba.format, texType, filtering);

    this.bloomFramebuffers.length = 0;
    for (let i = 0; i < this.config.BLOOM_ITERATIONS; i++)
    {
      let width = res.width >> (i + 1);
      let height = res.height >> (i + 1);

      if (width < 2 || height < 2) break;

      let fbo = createFBO(this.gl, width, height, rgba.internalFormat, rgba.format, texType, filtering);
      this.bloomFramebuffers.push(fbo);
    }
  }

  initSunraysFramebuffers() {
    let res = getResolution(this.gl, this.config.SUNRAYS_RESOLUTION);

    const texType = this.ext.halfFloatTexType;
    const r = this.ext.formatR;
    const filtering = this.ext.supportLinearFiltering ? this.gl.LINEAR : this.gl.NEAREST;

    this.sunrays     = createFBO(this.gl, res.width, res.height, r.internalFormat, r.format, texType, filtering);
    this.sunraysTemp = createFBO(this.gl, res.width, res.height, r.internalFormat, r.format, texType, filtering);
  }

  updateKeywords() {
    let displayKeywords = [];
    if (this.config.SHADING) displayKeywords.push("SHADING");
    if (this.config.BLOOM) displayKeywords.push("BLOOM");
    if (this.config.SUNRAYS) displayKeywords.push("SUNRAYS");
    this.displayMaterial.setKeywords(displayKeywords);
  }

  update() {
    const dt = this.calcDeltaTime();
    if (this.resizeCanvas(this.canvas)) {
      this.initFramebuffers();
    }

    this.updateColors(dt);
    this.applyInputs();
    if (!this.config.PAUSED) {
      this.step(dt);
    }

    this.render(null);
    requestAnimationFrame(() => {
      this.update();
    });
  }

  addRandomPoints() {
    this.splatStack.push(Math.floor(Math.random() * 20) + 5);

    const waitTime = Math.floor(Math.random() * 5000);
    setTimeout(() => {
      this.addRandomPoints();
    }, waitTime);
  }

  calcDeltaTime() {
    let now = Date.now();
    let dt = (now - this.lastUpdateTime) / 1000;
    dt = Math.min(dt, 0.016666);
    this.lastUpdateTime = now;
    return dt;
  }

  resizeCanvas(canvas: HTMLCanvasElement) {
    // todo: this seems to increase infinitely the canvas size,
    // wheras it shouldnt.
    let width = scaleByPixelRatio(window.innerWidth);
    let height = scaleByPixelRatio(window.innerHeight);
    if (canvas.width != width || canvas.height != height) {
      canvas.width = width;
      canvas.height = height;
      return true;
    }
    return false;
  }

  updateColors(dt) {
    if (!this.config.COLORFUL) return;

    this.colorUpdateTimer += dt * this.config.COLOR_UPDATE_SPEED;
    if (this.colorUpdateTimer >= 1) {
      this.colorUpdateTimer = wrap(this.colorUpdateTimer, 0, 1);
      this.pointers.forEach(p => {
        p.color = generateColor();
      });
    }
  }

  applyInputs () {
    if (this.splatStack.length > 0)
      this.multipleSplats(this.splatStack.pop());

    this.pointers.forEach(p => {
      if (p.moved) {
        p.moved = false;
        this.splatPointer(p);
      }
    });
  }

  step(dt) {
    this.gl.disable(this.gl.BLEND);
    this.gl.viewport(0, 0, this.velocity.width, this.velocity.height);

    this.curlProgram.bind();
    this.gl.uniform2f(this.curlProgram.uniforms.texelSize, this.velocity.texelSizeX, this.velocity.texelSizeY);
    this.gl.uniform1i(this.curlProgram.uniforms.uVelocity, this.velocity.read.attach(0));
    this.blit(this.curl.fbo);

    this.vorticityProgram.bind();
    this.gl.uniform2f(this.vorticityProgram.uniforms.texelSize, this.velocity.texelSizeX, this.velocity.texelSizeY);
    this.gl.uniform1i(this.vorticityProgram.uniforms.uVelocity, this.velocity.read.attach(0));
    this.gl.uniform1i(this.vorticityProgram.uniforms.uCurl, this.curl.attach(1));
    this.gl.uniform1f(this.vorticityProgram.uniforms.curl, this.config.CURL);
    this.gl.uniform1f(this.vorticityProgram.uniforms.dt, dt);
    this.blit(this.velocity.write.fbo);
    this.velocity.swap();

    this.divergenceProgram.bind();
    this.gl.uniform2f(this.divergenceProgram.uniforms.texelSize, this.velocity.texelSizeX, this.velocity.texelSizeY);
    this.gl.uniform1i(this.divergenceProgram.uniforms.uVelocity, this.velocity.read.attach(0));
    this.blit(this.divergence.fbo);

    this.clearProgram.bind();
    this.gl.uniform1i(this.clearProgram.uniforms.uTexture, this.pressure.read.attach(0));
    this.gl.uniform1f(this.clearProgram.uniforms.value, this.config.PRESSURE);
    this.blit(this.pressure.write.fbo);
    this.pressure.swap();

    this.pressureProgram.bind();
    this.gl.uniform2f(this.pressureProgram.uniforms.texelSize, this.velocity.texelSizeX, this.velocity.texelSizeY);
    this.gl.uniform1i(this.pressureProgram.uniforms.uDivergence, this.divergence.attach(0));
    for (let i = 0; i < this.config.PRESSURE_ITERATIONS; i++) {
      this.gl.uniform1i(this.pressureProgram.uniforms.uPressure, this.pressure.read.attach(1));
      this.blit(this.pressure.write.fbo);
      this.pressure.swap();
    }

    this.gradienSubtractProgram.bind();
    this.gl.uniform2f(this.gradienSubtractProgram.uniforms.texelSize, this.velocity.texelSizeX, this.velocity.texelSizeY);
    this.gl.uniform1i(this.gradienSubtractProgram.uniforms.uPressure, this.pressure.read.attach(0));
    this.gl.uniform1i(this.gradienSubtractProgram.uniforms.uVelocity, this.velocity.read.attach(1));
    this.blit(this.velocity.write.fbo);
    this.velocity.swap();

    this.advectionProgram.bind();
    this.gl.uniform2f(this.advectionProgram.uniforms.texelSize, this.velocity.texelSizeX, this.velocity.texelSizeY);
    if (!this.ext.supportLinearFiltering)
      this.gl.uniform2f(this.advectionProgram.uniforms.dyeTexelSize, this.velocity.texelSizeX, this.velocity.texelSizeY);
    let velocityId = this.velocity.read.attach(0);
    this.gl.uniform1i(this.advectionProgram.uniforms.uVelocity, velocityId);
    this.gl.uniform1i(this.advectionProgram.uniforms.uSource, velocityId);
    this.gl.uniform1f(this.advectionProgram.uniforms.dt, dt);
    this.gl.uniform1f(this.advectionProgram.uniforms.dissipation, this.config.VELOCITY_DISSIPATION);
    this.blit(this.velocity.write.fbo);
    this.velocity.swap();

    this.gl.viewport(0, 0, this.dye.width, this.dye.height);

    if (!this.ext.supportLinearFiltering)
      this.gl.uniform2f(this.advectionProgram.uniforms.dyeTexelSize, this.dye.texelSizeX, this.dye.texelSizeY);
    this.gl.uniform1i(this.advectionProgram.uniforms.uVelocity, this.velocity.read.attach(0));
    this.gl.uniform1i(this.advectionProgram.uniforms.uSource, this.dye.read.attach(1));
    this.gl.uniform1f(this.advectionProgram.uniforms.dissipation, this.config.DENSITY_DISSIPATION);
    this.blit(this.dye.write.fbo);
    this.dye.swap();
  }

  render (target) {
    if (this.config.BLOOM)
      this.applyBloom(this.dye.read, this.bloom);
    if (this.config.SUNRAYS) {
      this.applySunrays(this.dye.read, this.dye.write, this.sunrays);
      this.blur(this.sunrays, this.sunraysTemp, 1);
    }

    if (target == null || !this.config.TRANSPARENT) {
      this.gl.blendFunc(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);
      this.gl.enable(this.gl.BLEND);
    }
    else {
      this.gl.disable(this.gl.BLEND);
    }

    let width = target == null ? this.gl.drawingBufferWidth : target.width;
    let height = target == null ? this.gl.drawingBufferHeight : target.height;
    this.gl.viewport(0, 0, width, height);

    let fbo = target == null ? null : target.fbo;
    if (!this.config.TRANSPARENT)
      this.drawColor(fbo, normalizeColor(this.config.BACK_COLOR));
    if (target == null && this.config.TRANSPARENT)
      this.drawCheckerboard(fbo);
    this.drawDisplay(fbo, width, height);
  }

  drawColor (fbo, color) {
    this.colorProgram.bind();
    this.gl.uniform4f(this.colorProgram.uniforms.color, color.r, color.g, color.b, 1);
    this.blit(fbo);
  }

  drawCheckerboard (fbo) {
    this.checkerboardProgram.bind();
    this.gl.uniform1f(this.checkerboardProgram.uniforms.aspectRatio, this.canvas.width / this.canvas.height);
    this.blit(fbo);
  }

  drawDisplay (fbo, width, height) {
    this.displayMaterial.bind();
    if (this.config.SHADING)
      this.gl.uniform2f(this.displayMaterial.uniforms.texelSize, 1.0 / width, 1.0 / height);
    this.gl.uniform1i(this.displayMaterial.uniforms.uTexture, this.dye.read.attach(0));
    if (this.config.BLOOM) {
      this.gl.uniform1i(this.displayMaterial.uniforms.uBloom, this.bloom.attach(1));
      this.gl.uniform1i(this.displayMaterial.uniforms.uDithering, this.ditheringTexture.attach(2));
      let scale = getTextureScale(this.ditheringTexture, width, height);
      this.gl.uniform2f(this.displayMaterial.uniforms.ditherScale, scale.x, scale.y);
    }
    if (this.config.SUNRAYS)
      this.gl.uniform1i(this.displayMaterial.uniforms.uSunrays, this.sunrays.attach(3));
    this.blit(fbo);
  }

  applyBloom (source, destination) {
    if (this.bloomFramebuffers.length < 2)
      return;

    let last = destination;

    this.gl.disable(this.gl.BLEND);
    this.bloomPrefilterProgram.bind();
    let knee = this.config.BLOOM_THRESHOLD * this.config.BLOOM_SOFT_KNEE + 0.0001;
    let curve0 = this.config.BLOOM_THRESHOLD - knee;
    let curve1 = knee * 2;
    let curve2 = 0.25 / knee;
    this.gl.uniform3f(this.bloomPrefilterProgram.uniforms.curve, curve0, curve1, curve2);
    this.gl.uniform1f(this.bloomPrefilterProgram.uniforms.threshold, this.config.BLOOM_THRESHOLD);
    this.gl.uniform1i(this.bloomPrefilterProgram.uniforms.uTexture, source.attach(0));
    this.gl.viewport(0, 0, last.width, last.height);
    this.blit(last.fbo);

    this.bloomBlurProgram.bind();
    for (let i = 0; i < this.bloomFramebuffers.length; i++) {
      let dest = this.bloomFramebuffers[i];
      this.gl.uniform2f(this.bloomBlurProgram.uniforms.texelSize, last.texelSizeX, last.texelSizeY);
      this.gl.uniform1i(this.bloomBlurProgram.uniforms.uTexture, last.attach(0));
      this.gl.viewport(0, 0, dest.width, dest.height);
      this.blit(dest.fbo);
      last = dest;
    }

    this.gl.blendFunc(this.gl.ONE, this.gl.ONE);
    this.gl.enable(this.gl.BLEND);

    for (let i = this.bloomFramebuffers.length - 2; i >= 0; i--) {
      let baseTex = this.bloomFramebuffers[i];
      this.gl.uniform2f(this.bloomBlurProgram.uniforms.texelSize, last.texelSizeX, last.texelSizeY);
      this.gl.uniform1i(this.bloomBlurProgram.uniforms.uTexture, last.attach(0));
      this.gl.viewport(0, 0, baseTex.width, baseTex.height);
      this.blit(baseTex.fbo);
      last = baseTex;
    }

    this.gl.disable(this.gl.BLEND);
    this.bloomFinalProgram.bind();
    this.gl.uniform2f(this.bloomFinalProgram.uniforms.texelSize, last.texelSizeX, last.texelSizeY);
    this.gl.uniform1i(this.bloomFinalProgram.uniforms.uTexture, last.attach(0));
    this.gl.uniform1f(this.bloomFinalProgram.uniforms.intensity, this.config.BLOOM_INTENSITY);
    this.gl.viewport(0, 0, destination.width, destination.height);
    this.blit(destination.fbo);
  }

  applySunrays (source, mask, destination) {
    this.gl.disable(this.gl.BLEND);
    this.sunraysMaskProgram.bind();
    this.gl.uniform1i(this.sunraysMaskProgram.uniforms.uTexture, source.attach(0));
    this.gl.viewport(0, 0, mask.width, mask.height);
    this.blit(mask.fbo);

    this.sunraysProgram.bind();
    this.gl.uniform1f(this.sunraysProgram.uniforms.weight, this.config.SUNRAYS_WEIGHT);
    this.gl.uniform1i(this.sunraysProgram.uniforms.uTexture, mask.attach(0));
    this.gl.viewport(0, 0, destination.width, destination.height);
    this.blit(destination.fbo);
  }

  blur (target, temp, iterations) {
    this.blurProgram.bind();
    for (let i = 0; i < iterations; i++) {
      this.gl.uniform2f(this.blurProgram.uniforms.texelSize, target.texelSizeX, 0.0);
      this.gl.uniform1i(this.blurProgram.uniforms.uTexture, target.attach(0));
      this.blit(temp.fbo);

      this.gl.uniform2f(this.blurProgram.uniforms.texelSize, 0.0, target.texelSizeY);
      this.gl.uniform1i(this.blurProgram.uniforms.uTexture, temp.attach(0));
      this.blit(target.fbo);
    }
  }

  splatPointer (pointer) {
    let dx = pointer.deltaX * this.config.SPLAT_FORCE;
    let dy = pointer.deltaY * this.config.SPLAT_FORCE;
    this.splat(pointer.texcoordX, pointer.texcoordY, dx, dy, pointer.color);
  }

  multipleSplats (amount) {
    for (let i = 0; i < amount; i++) {
      const color = generateColor();
      color.r *= 10.0;
      color.g *= 10.0;
      color.b *= 10.0;
      const x = Math.random();
      const y = Math.random();
      const dx = 1000 * (Math.random() - 0.5);
      const dy = 1000 * (Math.random() - 0.5);
      this.splat(x, y, dx, dy, color);
    }
  }

  splat (x, y, dx, dy, color) {
    this.gl.viewport(0, 0, this.velocity.width, this.velocity.height);
    this.splatProgram.bind();
    this.gl.uniform1i(this.splatProgram.uniforms.uTarget, this.velocity.read.attach(0));
    this.gl.uniform1f(this.splatProgram.uniforms.aspectRatio, this.canvas.width / this.canvas.height);
    this.gl.uniform2f(this.splatProgram.uniforms.point, x, y);
    this.gl.uniform3f(this.splatProgram.uniforms.color, dx, dy, 0.0);
    this.gl.uniform1f(this.splatProgram.uniforms.radius, correctRadius(this.canvas, this.config.SPLAT_RADIUS / 100.0));
    this.blit(this.velocity.write.fbo);
    this.velocity.swap();

    this.gl.viewport(0, 0, this.dye.width, this.dye.height);
    this.gl.uniform1i(this.splatProgram.uniforms.uTarget, this.dye.read.attach(0));
    this.gl.uniform3f(this.splatProgram.uniforms.color, color.r, color.g, color.b);
    this.blit(this.dye.write.fbo);
    this.dye.swap();
  }

  captureScreenshot() {
    let res = getResolution(this.gl, this.config.CAPTURE_RESOLUTION);
    let target = createFBO(this.gl, res.width, res.height, this.ext.formatRGBA.internalFormat, this.ext.formatRGBA.format, this.ext.halfFloatTexType, this.gl.NEAREST);
    this.render(target);

    let texture: Float32Array | Uint8Array = framebufferToTexture(target, this.gl);
    texture = normalizeTexture(texture, target.width, target.height);

    let captureCanvas = textureToCanvas(texture, target.width, target.height);
    let datauri = captureCanvas.toDataURL();
    downloadURI('fluid.png', datauri);
    URL.revokeObjectURL(datauri);
  }

}
