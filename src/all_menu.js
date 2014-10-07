/**
 * all game's menu
 * Created by WG on 2014/8/30.
 */
var AllMenuScene =  cc.Scene.extend({
    onEnter:function(){
        this._super();
        var menuLayer = new AllMenuLayer();
        this.addChild(menuLayer);
    }
});
// all game need to return to the main menu, so add this static func here
AllMenuScene.onGameReturnAllMenu = function(){
    cc.audioEngine.stopMusic(true);
    cc.audioEngine.stopAllEffects();
    console.log("go back from game to all menu");
    var scene = new AllMenuScene();
    cc.director.runScene(new cc.TransitionFade(1.2, scene));
};
var AllMenuLayer = cc.Layer.extend({
    ctor:function(){
        this._super();
        this.init();
    },
    init:function(){
        var winSize = cc.winSize;
        var back = new cc.Sprite(res.allmenuback_jpg);
        this.addChild(back, 1);
        back.attr({
            x:winSize.width/2,
            y:winSize.height/2
        });

        var gameLabel = new cc.LabelTTF("随便写的小游戏", "Arial", 30);
        gameLabel.setColor(cc.color.RED);
        gameLabel.attr({x:winSize.width/2, y:winSize.height - 100});
        this.addChild(gameLabel, 1);

        var gameNamesArray = ["Plane", "Tank", "Simple Plane", "Remove"];
        var gameMenuGroup = this.initGameMenuGroup(gameNamesArray);
        make_center(gameMenuGroup);
        //otherwise all games with display in the same y
        gameMenuGroup.alignItemsVerticallyWithPadding(10);
        this.addChild(gameMenuGroup, 2);
    },
    //init menu with game names
    initGameMenuGroup:function(gameNameArry){
        var gameLableMenuArray = [];
        for(var i in gameNameArry){
            var gameName = gameNameArry[i];
            var gameLabel = new cc.LabelTTF(gameName, "Arial", 50);
            gameLabel.setColor(cc.color.BLACK);
            var gameLabelMenu = new cc.MenuItemLabel(gameLabel, this.onChooseGame, gameName);
            gameLableMenuArray.push(gameLabelMenu);
        }
        var gameMenuGroup = new cc.Menu(gameLableMenuArray);
        return gameMenuGroup;
    },
    onChooseGame:function(target){
        var gameName = this.toString();
        console.log("choose game:"+gameName);
        var gameSceneType;
        var gameResType;
        switch(gameName){
            case "Plane":
                gameSceneType = PlaneMenuScene;
                gameResType = g_planemenures;
                break;
            case "2048":
                return ;
                gameSceneType = Scene;
                gameResType = g_sceneres;
                break;
            case "Simple Plane":
                gameSceneType = SimplePlaneScene;
                gameResType = g_simpleplaneres;
                break;
            case "Remove":
                gameSceneType = RemoveScene;
                gameResType = g_removeres;
                break;
            default:
        }
        cc.LoaderScene.preload(gameResType, function () {
            var scene = new gameSceneType();
            cc.director.runScene(new cc.TransitionFade(0.5, scene));
        }, this);
    }
});
