
var SimplePlaneLayer = cc.Layer.extend({
    hero:null,
    pos:null,
    bullets:null,
    enemys:null,
    enemy_bullets:null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();
        this.init();
    },
    score:0,
    scoreBoard:null,
    init:function(){
        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

        // add a "close" icon to exit the progress. it's an autorelease object
        /*var closeItem = new cc.MenuItemImage( res.CloseNormal_png, res.CloseSelected_png, function () {
                cc.log("Menu is clicked!");
            }, this);
            */
        var goBackLabel = new cc.LabelTTF("return", "Arial", 22);
        var goBackLabelItem = new cc.MenuItemLabel(goBackLabel,AllMenuScene.onGameReturnAllMenu);
        var menu = new cc.Menu(goBackLabelItem);
        menu.attr({
            x: size.width - 20,
            y: 20
        });
        this.addChild(menu, 1);

        var back = new cc.Sprite(res.back_png);
        back.setPosition(cc.p(cc.winSize.width/2, cc.winSize.height/2));
        this.addChild(back);


        this.hero = new cc.Sprite(res.hero_png);
        this.hero.setScale(0.25);
        this.pos = {x:size.width/2, y:size.height/2};
        this.hero.setPosition(cc.p(this.pos.x, this.pos.y));
        this.addChild(this.hero);
        //这里创建了一个匿名的Listener对象，所以onTouchBegan的this是这个Listener
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan,
            onTouchMoved: this.onTouchMoved,
            onTouchEnded: this.onTouchEnded
        }, this);
        this.schedule(this.shot, 0.1);
        this.schedule(this.enemyUpdate, 0.5);
        this.schedule(this.hit);
        this.bullets = [];
        this.enemys = [];
        this.enemy_bullets = [];

        this.score = 0;
        this.scoreBoard = cc.LabelTTF.create(this.score.toString(), "Impact", 28);
        this.scoreBoard.setColor(cc.color.YELLOW);
        this.scoreBoard.setPosition(cc.p(3*cc.winSize.width/4, cc.winSize.height - 40));
        this.addChild(this.scoreBoard);
        return true;
    },
    hit:function(){
        var hero_box = this.hero.getBoundingBox();
        for(var i in this.enemys){
            var enemy = this.enemys[i];
            var enemy_box = enemy.getBoundingBox();
            if(cc.rectIntersectsRect(hero_box, enemy_box)){
                this.score -= 2;
                var enemy_index = this.enemys.indexOf(enemy);
                if(enemy_index>-1){
                    this.enemys.splice(enemy_index, 1);
                    this.removeChild(enemy);
                }
                //如果敌机和自己相撞，就不判断敌机被子弹打中了
                continue;
            }
            for(var j in this.bullets){
                var bullet = this.bullets[j];
                var bullet_box = bullet.getBoundingBox();
                if(cc.rectIntersectsRect(bullet_box, enemy_box)){
                    this.score ++;
                    this.scoreBoard.setString(this.score);
                    cc.audioEngine.playEffect(res.hit_mp3);

                    var bullet_index = this.bullets.indexOf(bullet);
                    if(bullet_index>-1){
                        this.bullets.splice(bullet_index, 1);
                        this.removeChild(bullet);
                    }
                    var enemy_index = this.enemys.indexOf(enemy);
                    if(enemy_index>-1){
                        this.enemys.splice(enemy_index, 1);
                        this.removeChild(enemy);
                    }
                }
            }
        }
        for(var i in this.enemy_bullets){
            var enemy_bullet = this.enemy_bullets[i];
            var enemy_bullet_box = enemy_bullet.getBoundingBox();
            if(cc.rectIntersectsRect(hero_box, enemy_bullet_box)){
                this.score --;
                var enemy_bullet_index = this.enemy_bullets.indexOf(enemy_bullet);
                if(enemy_bullet_index> -1){
                    this.enemy_bullets.splice(enemy_bullet_index, 1);
                    this.removeChild(enemy_bullet);
                }
            }
        }
    },
    enemyUpdate:function(){
        var target = cc.Sprite.create(res.hero_png);
        target.setScale(0.25);
        target.setRotation(180);
        var minX = target.getContentSize().width/2;
        var maxX = cc.winSize.width-target.getContentSize().width/2;
        var x = Math.random()*(maxX-minX)+minX;
        var minDuration = 7.0;
        var maxDuration = 10.0;
        var duration = minDuration + (maxDuration-minDuration)*Math.random();
        target.setPosition(cc.p(x, cc.winSize.height-target.getContentSize().height/2));
        var actionMove = cc.MoveTo.create(duration, cc.p(x, -target.getContentSize().height));
        var actionMoveDone = cc.CallFunc.create(this.Fin, this);
        target.runAction(cc.Sequence.create(actionMove, actionMoveDone));
        target.setTag(2);
        this.addChild(target);
        this.enemys.push(target);

        //add enemy bullet
        var bullet = cc.Sprite.create(res.bullet_png, cc.rect(0,50,33,70));
        bullet.setRotation(180);
        bullet.setPosition(cc.p(target.x, target.y));
        duration = (target.getPosition().y/cc.winSize.height)*3;
        actionMove = cc.MoveTo.create(duration, cc.p(target.getPosition().x, 0));
        actionMoveDone = cc.CallFunc.create(this.Fin, this);
        bullet.runAction(cc.Sequence.create(actionMove, actionMoveDone));
        bullet.setTag(3);
        this.addChild(bullet);
        this.enemy_bullets.push(bullet);
    },
    shot:function(){
        var hero_pos = this.hero.getPosition();
        var bulletDuration = 0.5;
        var bullet = cc.Sprite.create(res.bullet_png, cc.rect(0,0,33,33));
        bullet.setPosition(cc.p(hero_pos.x, hero_pos.y+ bullet.getContentSize().height));
        var time = (cc.winSize.height - hero_pos.y - bullet.getContentSize().height/2)/cc.winSize.height;
        var actionMove = cc.MoveTo.create(bulletDuration *time, cc.p(hero_pos.x, cc.winSize.height));
        var actionMoveDone = cc.CallFunc.create(this.Fin, this);
        bullet.runAction(cc.Sequence.create(actionMove, actionMoveDone));
        cc.audioEngine.playMusic(res.shot_mp3);
        bullet.setTag(1);
        this.addChild(bullet);
        this.bullets.push(bullet);
    },
    Fin:function(sprite){
        this.removeChild(sprite, true);
        var type = sprite.getTag();
        switch(type){
            case 1:
                var index1 = this.bullets.indexOf(sprite);
                if(index1 > -1){
                    this.bullets.splice(index1, 1);
                }
                break;
            case 2:
                var index2= this.enemys.indexOf(sprite);
                if(index2 > -1) {
                    this.enemys.splice(index2, 1);
                }
                break;
            case 3:
                var index3= this.enemy_bullets.indexOf(sprite);
                    if(index3 > -1) {
                        this.enemy_bullets.splice(index3, 1);
                    }
                break;
        }
    },
    onTouchBegan:function(touch, event){
        var point = touch.getLocation();
        //注意这里的touch_start是当前listener类的元素，不是layer的
        this.touch_start = {x:point.x, y:point.y};
        return true;
    },
    onTouchMoved:function(touch, event){
        var point = touch.getLocation();
        this.touch_end = {x:point.x, y:point.y};
        //通过传入的event的_currentTarget来获得this对象
        event._currentTarget.hero.setPosition(cc.p(point.x, point.y));
    },
    onTouchEnded:function(touch, event){
        var point = touch.getLocation();
        this.touch_end = {x:point.x, y:point.y};
        cc.log("("+this.touch_start.x+","+this.touch_start.y+")("+this.touch_end.x+","+this.touch_end.y+")");
        //event._currentTarget.hero.setPosition(cc.p(this.touch_end.x, this.touch_end.y));
    }
});

var SimplePlaneScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new SimplePlaneLayer();
        this.addChild(layer);
    }
});

