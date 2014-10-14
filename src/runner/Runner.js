/**
 * Created by wg on 14-10-12.
 */
var BackLayer = cc.Layer.extend({
    map00:null,
    map01:null,
    mapWidth:0,
    mapIndex:0,
    objects:null,
    space:null,
    spriteSheet:null,
    ctor: function (space) {
        this._super();
        this.space = space;
        this.objects = [];
        this.init();
    },
    init: function () {
        /*var winSize = cc.winSize;
        var spriteBG = new cc.Sprite(res.PlayBG_png);
        spriteBG.attr({
            x:winSize.width/2,
            y:winSize.height/2
        });
        this.addChild(spriteBG);
        */
        this.map00 = new cc.TMXTiledMap(res.map00_tmx);
        this.addChild(this.map00);
        this.mapWidth = this.map00.getContentSize().width;
        this.map01 = new cc.TMXTiledMap(res.map01_tmx);
        this.map01.setPosition(cc.p(this.mapWidth, 0));
        this.addChild(this.map01);
        this.scheduleUpdate();

        cc.spriteFrameCache.addSpriteFrames(res.background_plist);
        this.spriteSheet = new cc.SpriteBatchNode(res.background_png);
        this.addChild(this.spriteSheet);
        this.loadObjects(this.map00, 0);
        this.loadObjects(this.map01, 1);
    },
    loadObjects:function(map, mapIndex){
        var coinGroup = map.getObjectGroup("coin");
        var coinArray = coinGroup.getObjects();
        for(var i=0; i< coinArray.length; i++){
            var coin = new Coin(this.spriteSheet,
                this.space,
                cc.p(coinArray[i]["x"]+this.mapWidth*mapIndex, coinArray[i]["y"])
            );
            coin.mapIndex = mapIndex;
            this.objects.push(coin);
        }
        var rockGroup = map.getObjectGroup("rock");
        var rockArray = rockGroup.getObjects();
        for(var i=0; i< rockArray.length; i++) {
            var rock = new Rock(this.spriteSheet,
                this.space,
                rockArray[i]["x"] + this.mapWidth * mapIndex
            );
            rock.mapIndex = mapIndex;
            this.objects.push(rock);
        }
    },
    removeObjects:function(mapIndex){
        while((function(obj, index){
            for(var i=0; i< obj.length; i++){
                if(obj[i].mapIndex == index){
                    obj[i].removeFromParent();
                    obj.splice(i, 1);
                    return true;
                }
            }
            return false;
        })(this.objects, mapIndex));
    },
    removeObjectByShape:function(shape){
        for(var i=0; i< this.objects.length; i++){
            if(this.objects[i].getShape() == shape){
                this.objects[i].removeFromParent();
                this.objects.splice(i, 1);
                break;
            }
        }
    },
    checkAndReload:function(eyeX){
       var newMapIndex = parseInt(eyeX/this.mapWidth);
        if(this.mapIndex == newMapIndex){
            return false;
        }
        if(0 == newMapIndex%2){
            this.map01.setPositionX(this.mapWidth*(newMapIndex+1));
            this.loadObjects(this.map01, newMapIndex+1);
        }else{
            this.map00.setPositionX(this.mapWidth*(newMapIndex+1));
            this.loadObjects(this.map00, newMapIndex+1);
        }
        this.removeObjects(newMapIndex-1);
        this.mapIndex = newMapIndex;
        return true;
    },
    update:function(dt){
        var animationLayer = this.getParent().getChildByTag(TagOfLayer.animation);
        var eyeX = animationLayer.getEyeX();
        this.checkAndReload(eyeX);
    }

});
var AnimationLayer = cc.Layer.extend({
    space:null,
    spriteSheet:null,
    runningAction:null,
    sprite:null,
    body:null,
    shape:null,
    ctor: function(space){
        this._super();
        this.space = space;
        this._debugNode = new cc.PhysicsDebugNode(this.space);
        this.addChild(this._debugNode, 10);
        this.init();
    },
    init:function(){
        var winSize = cc.winSize;
        //var spriteRunner = new cc.Sprite(res.runner_png);
        //load sprite frame
        cc.spriteFrameCache.addSpriteFrames(res.runner_plist);
        //new batch node(qucik draw)_
        this.spriteSheet = new cc.SpriteBatchNode(res.runner_png);
        this.addChild(this.spriteSheet);

        //use sprite frame to make animation
        var animFrames = [];
        for(var i=0; i<8;i++){
            var str = "runner"+i+".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            animFrames.push(frame);
        }
        var animation = new cc.Animation(animFrames, 0.1);
        this.runningAction = new cc.RepeatForever(new cc.Animate(animation));

        //init physics sprite and body and shape
        this.sprite = new cc.PhysicsSprite("#runner0.png");
        var contentSize = this.sprite.getContentSize();
        this.body = new cp.Body(1, cp.momentForBox(1, contentSize.width, contentSize.height));
        this.body.p = cc.p(g_runnerStartX, g_groundHight+contentSize.height/2);
        this.body.applyImpulse(cp.v(150,0), cp.v(0,0));
        this.space.addBody(this.body);
        this.sprite.setBody(this.body);

        this.shape = new cp.BoxShape(this.body, contentSize.width-14, contentSize.height);
        this.space.addShape(this.shape);

        //run action
        this.sprite.runAction(this.runningAction);
        //add sprite to batch node
        this.spriteSheet.addChild(this.sprite);
        this.addChild(this.sprite);
    },
    getEyeX:function(){
        return this.sprite.getPositionX() - g_runnerStartX;
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
    gameLayer:null,
    shapesToRemove:[],
    initPhysics:function(){
        this.space = new cp.Space();
        this.space.gravity = cp.v(0, -350);
        var wallBottom = new cp.SegmentShape(this.space.staticBody,
            cp.v(0, g_groundHight),
            cp.v(4294967295, g_groundHight),
            0 );
        this.space.addStaticShape(wallBottom);
        this.space.addCollisionHandler(TagOfSprite.runner, TagOfSprite.coin, this.collisionCoinBegin.bind(this), null, null, null);
        this.space.addCollisionHandler(TagOfSprite.runner, TagOfSprite.rock, this.collisionRockBegin.bind(this), null, null, null);
    },
    collisionCoinBegin:function(arbiter, space){
        var shapes = arbiter.getShapes();
        this.shapesToRemove.push(shapes[1]);
    },
    collisionRockBegin:function(arbiter, space){
        cc.log("==game over");

    },
    update:function(dt){
        this.space.step(dt);
        var animatinoLayer = this.gameLayer.getChildByTag(TagOfLayer.animation);
        var eyeX = animatinoLayer.getEyeX();
        this.gameLayer.setPosition(cc.p(-eyeX,0));

        for(var i=0; i< this.shapesToRemove.length;i++){
            var shape = this.shapesToRemove[i];
            this.gameLayer.getChildByTag(TagOfLayer.background).removeObjectByShape(shape) ;
        }
        this.shapesToRemove = [];
    },
    onEnter:function () {
        this._super();
        this.shapesToRemove = [];
        this.initPhysics();
        this.gameLayer = new cc.Layer();
        this.gameLayer.addChild(new BackLayer(this.space), 0, TagOfLayer.background);
        this.gameLayer.addChild(new AnimationLayer(this.space), 0, TagOfLayer.animation);
        this.addChild(this.gameLayer);
        this.addChild(new StatusLayer(), 0, TagOfLayer.status);
        this.scheduleUpdate();
    }
});
var Coin = cc.Class.extend({
    space:null,
    sprite:null,
    shape:null,
    _mapIndex:0,
    get mapIndex(){
        return this._mapIndex;
    },
    set mapIndex(index){
        this._mapIndex = index;
    },
    ctor:function(spriteSheet, space, pos){
        this.space = space;
        var animFrames = [];
        for(var i=0; i< 8; i++){
            var str = "coin"+i+".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            animFrames.push(frame);
        }
        var animation = new cc.Animation(animFrames, 0.2);
        var action = new cc.RepeatForever(new cc.Animate(animation));
        this.sprite = new cc.PhysicsSprite("#coin0.png");

        var radius = 0.95 * this.sprite.getContentSize().width/2;
        var body = new cp.StaticBody();
        body.setPos(pos);
        this.sprite.setBody(body);
        this.shape = new  cp.CircleShape(body, radius, cp.vzero);
        this.shape.setCollisionType(TagOfSprite.coin);
        this.shape.setSensor(true);
        this.space.addStaticShape(this.shape);
        this.sprite.runAction(action);
        spriteSheet.addChild(this.sprite, 1);
    },
    removeFromParent:function(){
        this.space.removeStaticShape(this.shape);
        this.shape = null;
        this.sprite.removeFromParent();
        this.sprite = null;
    },
    getShape:function(){
        return this.shape;
    }
});
var Rock = cc.Class.extend({
    space:null,
    sprite:null,
    shape:null,
    _mapIndex:0,
    get mapIndex(){
        return this._mapIndex;
    },
    set mapIndex(index){
        this._mapIndex = index;
    },
    ctor:function(spriteSheet, space, posX){
        this.space = space;
        this.sprite = new cc.PhysicsSprite("#rock.png");
        var body = new cp.StaticBody();
        body.setPos(cc.p(posX, this.sprite.getContentSize().height/2 + g_groundHight));
        this.sprite.setBody(body);
        this.shape = new  cp.BoxShape(body,
            this.sprite.getContentSize().width,
            this.sprite.getContentSize().height
        );
        this.shape.setCollisionType(TagOfSprite.rock);
        this.space.addStaticShape(this.shape);
        spriteSheet.addChild(this.sprite);
    },
    removeFromParent:function(){
        this.space.removeStaticShape(this.shape);
        this.shape = null;
        this.sprite.removeFromParent();
        this.sprite = null;
    },
    getShape:function(){
        return this.shape;
    }
});
