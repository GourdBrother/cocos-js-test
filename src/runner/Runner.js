/**
 * Created by wg on 14-10-12.
 */
var BackLayer = cc.Layer.extend({
    ctor: function () {
        this._super();
        this.init();
    },
    init: function () {
        var winSize = cc.winSize;
        var spriteBG = new cc.Sprite(res.PlayBG_png);
        spriteBG.attr({
            x:winSize.width/2,
            y:winSize.height/2
        });
        this.addChild(spriteBG);
    }
});
var AnimationLayer = cc.Layer.extend({
    space:null,
    spriteSheet:null,
    runningAction:null,
    sprite:null,
    ctor: function(space){
        this._super();
        this.space = space;
        this.init();
    },
    init:function(){
        var winSize = cc.winSize;
        //var spriteRunner = new cc.Sprite(res.runner_png);
        cc.spriteFrameCache.addSpriteFrames(res.runner_plist);
        this.spriteSheet = new cc.SpriteBatchNode(res.runner_png);
        this.addChild(this.spriteSheet);

        var animFrames = [];
        for(var i=0; i<8;i++){
            var str = "runner"+i+".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            animFrames.push(frame);
        }
        var animation = new cc.Animation(animFrames, 0.1);
        this.runningAction = new cc.RepeatForever(new cc.Animate(animation));
        this.sprite = new cc.Sprite("#runner0.png");
        this.sprite.attr({x:80, y:85});
        this.addChild(this.sprite);
        this.sprite.runAction(this.runningAction);
        this.spriteSheet.addChild(this.sprite);
    }
});
var StatusLayer = cc.Layer.extend({
    labelCoin:null,
    labelMaser:null,
    coins:0,
    ctor: function(){
        this._super();
        this.init();
    },
    init:function(){
        var winSize = cc.winSize;
        this.labelCoin = new cc.LabelTTF("Coins:0", "Helvetica", 20);
        this.labelCoin.setColor(cc.color(0,0,0));
        this.labelCoin.attr({x:70, y:winSize.height-20});
        this.addChild(this.labelCoin);
        this.labelMeter = new cc.LabelTTF("0M", "Helvetica", 20);
        this.labelMeter.attr({x:winSize.width-70, y:winSize.height-20});
        this.addChild(this.labelMeter);
    }
});
var RunnerScene = cc.Scene.extend({
    space:null,
    initPhysics:function(){
        this.space = new cp.Space();
        this.space.gravity = cp.v(0, -350);
        var wallBottom = new cp.SegmentShape(this.space.staticBody,
            cp.v(0, g_groundHight),
            cp.v(4294967295, g_groundHight),
            0 );
        this.space.addStaticShape(wallBottom);
    },
    update:function(dt){
        this.space.step(dt);
    },
    onEnter:function () {
        this._super();
        this.initPhysics();
        var layer = new BackLayer();
        this.addChild(layer);
        layer = new AnimationLayer(this.space);
        this.addChild(layer);
        var layer = new StatusLayer();
        this.addChild(layer);
        this.scheduleUpdate();
    }
});