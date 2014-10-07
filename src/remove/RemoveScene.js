/**
 *
 * Created by WG on 2014/8/31.
 */
var RemoveScene =  cc.Scene.extend({
    bricks:null,
    noTouchLayer:null,
    scoreLabel:null,
    timeLabel:null,
    onEnter:function(){
        this._super();
        var removeLayer = new RemoveLayer();
        this.addChild(removeLayer);
    },
    disableTouch:function(){
        var layer = DisableTouch(this);
        this.noTouchLayer = layer;
    },
    enableTouch:function(){
        EnableTouch(this.noTouchLayer);
        this.noTouchLayer = null;
    }
});
var RemoveLayer = cc.Layer.extend({
    ctor:function(){
        this._super();
        //add delay because use TransitionFade(0.5) to change scene, here wait for change
        var wait = cc.sequence(cc.delayTime(0.5), cc.callFunc(this.init, this));
        this.runAction(wait);
        //this.init();
    },
    init:function(){
        cc.audioEngine.playMusic( res.brick_back_mp3, true);
        var winSize = cc.winSize;
        var back = new cc.Sprite(res.brick_back_png);
        back.attr({ x:winSize.width/2, y:winSize.height/2 });
        this.addChild(back, 1);

        var bricks = new Bricks(6, 6, this);
        this.bricks = bricks;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan,
            onTouchMoved: this.onTouchMoved,
            onTouchEnded: this.onTouchEnded
        }, this);
        var goBackLabel = new cc.LabelTTF("return", "Arial", 22);
        var retryLabel = new cc.LabelTTF("retry", "Arial", 22);
        var checkLabel = new cc.LabelTTF("check", "Arial", 22);
        var testLabel = new cc.LabelTTF("test", "Arial", 22);
        var timeLabel = new cc.LabelTTF("time:", "Arial", 22);
        var scoreLabel = new cc.LabelTTF("score:", "Arial", 22);
        timeLabel.setColor(cc.color.RED);
        scoreLabel.setColor(cc.color.RED);
        var goBackLabelItem = new cc.MenuItemLabel(goBackLabel, AllMenuScene.onGameReturnAllMenu);
        var checkLabelItem = new cc.MenuItemLabel(checkLabel, this.bricks.CheckAllLoop, this.bricks);
        var retryLabelItem = new cc.MenuItemLabel(retryLabel ,this.onRetry, this);
        var testLabelItem = new cc.MenuItemLabel(testLabel ,this.onTest, this);
        var menuGroup = new cc.Menu(checkLabelItem, retryLabelItem, goBackLabelItem, testLabelItem);
        this.addChild(menuGroup, 2);
        menuGroup.alignItemsVerticallyWithPadding(20);
        menuGroup.attr({
            x: cc.winSize.width - 30,
            y: cc.winSize.height/2
        });
        this.addChild(timeLabel, 2);
        timeLabel.attr({
            x:cc.winSize.width/2-60,
            y:cc.winSize.height-60
        });
        scoreLabel.attr({
            x:cc.winSize.width/2+60,
            y:cc.winSize.height-60
        });
        this.addChild(scoreLabel, 2);
        this.scoreLabel = scoreLabel;
        this.timeLabel = timeLabel;
        this.schedule(this.TimeCal, 1);
        this.scoreLabel.setString("score:"+this.bricks.score);
    },
    timeAll:30,
    timeCost:0,
    TimeCal:function(){
        this.timeCost ++;
        this.timeLabel.setString("time:" + (this.timeAll - this.timeCost));
        this.scoreLabel.setString("score:" + this.bricks.score);

        if(this.timeCost >= this.timeAll){
           this.GameOver();
        }
    },
    GameOver:function(){
        cc.audioEngine.stopMusic();
        cc.audioEngine.stopAllEffects();
        CONFIG.SCORE = this.bricks.score;
        var scene = new cc.Scene();
        scene.addChild(new GameOverLayer);
        cc.director.runScene(new cc.TransitionFade(1.2, scene));
    },
    onRetry:function(){
        this.bricks.ReColorAll();
        this.bricks.CheckAllLoop();
    },
    onTest:function(){
        this.bricks.ShowAll();
    },
    onTouchEnded:function(touch, event){
        var location = touch.getLocation();
        var target = event.getCurrentTarget();

        var last_brick = target.bricks.PosToBrick(this.last_touch_begin);
        if(last_brick.x == -1 || last_brick.y == -1){
            console.log("from envalid");
            return ;
        }
        var now_brick = target.bricks.PosToBrick(location);
        if(now_brick.x == -1 || now_brick.y == -1){
            console.log("to envalid");
            return ;
        }
        if(Math.abs(now_brick.x - last_brick.x) + Math.abs(now_brick.y - last_brick.y) == 1){
            console.log("from ("+last_brick.x+","+last_brick.y+") to ("+now_brick.x+","+now_brick.y+")");
            target.bricks.Switch(last_brick, now_brick);
        }
    },
    last_touch_begin:null,
    onTouchBegan:function(touch){
        this.last_touch_begin = touch.getLocation();
        return true;
    },
    onTouchMoved:function(touch){
        //var brick_index = this.bricks.PosToBrick(start.x, start.y);
        //console.log(brick_index);
    }
});

