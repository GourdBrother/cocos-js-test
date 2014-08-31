/**
 * Created by WG on 2014/8/21.
 */
var PlaneMenuScene =  cc.Scene.extend({
    onEnter:function(){
        this._super();
        var planeMenuLayer = new PlaneMenuLayer();
        this.addChild(planeMenuLayer);
    }
});
var PlaneMenuLayer = cc.Layer.extend({
    ctor:function(){
        this._super();
        this.init();
    },
    init:function(){
        var winSize = cc.winSize;
        var back = new cc.Sprite(res.back_png);
        this.addChild(back, 1);
        back.attr({
           x:winSize.width/2,
           y:winSize.height/2
        });

        var newGameEna = new cc.Sprite(res.menu_png, cc.rect(0,0,126,33));
        var newGameClick = new cc.Sprite(res.menu_png, cc.rect(0,33,126,33));
        var newGameDis = new cc.Sprite(res.menu_png, cc.rect(0,66,126,33));
        var newGame = new cc.MenuItemSprite(newGameEna, newGameClick, newGameDis, this.onStartButton.bind(this));

        var AboutGameEna = new cc.Sprite(res.menu_png, cc.rect(126,0,126,33));
        var AboutGameClick = new cc.Sprite(res.menu_png, cc.rect(126,33,126,33));
        var AboutGameDis = new cc.Sprite(res.menu_png, cc.rect(126,66,126,33));
        var AboutGame = new cc.MenuItemSprite(AboutGameEna, AboutGameClick, AboutGameDis, this.onAboutGame);
        var menu = new cc.Menu(newGame, AboutGame);
        this.addChild(menu, 3);
        menu.attr({
           x:winSize.width/2,
           y:winSize.height/2-80
        });
        menu.alignItemsVerticallyWithPadding(50);
        cc.spriteFrameCache.addSpriteFrames(res.texture_plist);

        this._ship = new cc.Sprite("#ship01.png");
        this.addChild(this._ship, 5, 4);
        this._ship.x = Math.random()*winSize.width;
        this._ship.y = 0;
        this._ship.runAction(cc.moveBy(2, cc.p(Math.random()*winSize.width, this._ship.y+winSize.height)));
        this.schedule(this.update, 0.1);

        cc.audioEngine.setMusicVolume(0.7);
        cc.audioEngine.playMusic(res.mainMainMusic_mp3, true);
        this.flare = new cc.Sprite(res.flare_png);
        this.addChild(this.flare, 15, 10);
        this.flare.visible= false;
        var goBackLabel = new cc.LabelTTF("return", "Arial", 22);
        var goBackLabelItem = new cc.MenuItemLabel(goBackLabel,AllMenuScene.onGameReturnAllMenu);
        var backMenu = new cc.Menu(goBackLabelItem);
        backMenu.attr({
            x: cc.winSize.width - 20,
            y: 20
        });
        this.addChild(backMenu, 1);

    },
    flare:null,
    update:function(){
        var winSize = cc.winSize;
        if(this._ship.y  > winSize.height - 20){
            this._ship.x = Math.random()*winSize.width;
            this._ship.y = 0;
            this._ship.runAction(cc.moveBy(2, cc.p(Math.random()*winSize.width, this._ship.y+winSize.height)));
        }
    },
    _ship:null,
    onStartButton:function(){
        //this.onButtonEffect();
        flareEffect(this.flare, this, this.onGameStart);
        this.onButtonEffect();
    },
    onButtonEffect:function(){
       var s = cc.audioEngine.playEffect(res.buttonEffect_mp3);
    },
    onGameStart:function(){
        console.log("hi");

    }
});
