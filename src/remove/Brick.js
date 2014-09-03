/**
 * logic for bricks
 * Created by WG on 2014/8/31.
 */
var Brick = cc.Sprite.extend({
    colorType:null,
    row:null,
    column:null,
    remove:false,
    colorCount:6,
    ctor:function( row, column){
        this._super();
        this.row = row;
        this.column = column;
        this.colorType = this.ReColor({color:undefined, waitTime:0});
    },

    /**
     *
     * @param args{color,time}
     * @returns {*}
     * @constructor
     */
    ReColor:function(args) {
        var color = args.color;
        var oldColor = args.oldColor;
        var waitTime = args.waitTime;
        var time = args.time;
        var png_name;
        //not give the color, random it
        if (color === undefined) {
            color = Math.floor(Math.random() * this.colorCount) + 1;
        }
        this.colorType = color;
        var png_name = Bricks.ColorRes[color];
        var old_png_name;
        if(oldColor != undefined){
            old_png_name = Bricks.ColorRes[oldColor];
        }
        var min = new cc.ScaleTo(0.2, 0.1);
        var max = new cc.ScaleTo(0.2, 1);
        var func= function(obj, data){
            this.setTexture(data);
        };
        var change = new cc.CallFunc(func, this, png_name);
        this.runAction( new cc.Sequence( new cc.DelayTime(waitTime), min,change, max));


        // use framespite to acheieve one brick to another brick
        /*var old_png_name;
        if (oldColor != undefined) {
            old_png_name = Bricks.ColorRes[oldColor];
        }
        var animation = new cc.Animation();
        if (oldColor != undefined) {
            animation.addSpriteFrameWithFile(old_png_name);
        }
        animation.addSpriteFrameWithFile(png_name);
        animation.setDelayPerUnit(0.2/2);
        var action =  new cc.Animate(animation);
        this.runAction(action);
        */
        this.remove = false;
        return color;
    },
    test:function(){
    }

});
var Bricks = cc.Class.extend({
    row_num:null,
    column_num:null,
    brick_size:34,
    brick_gap:38,
    bricks:[],
    center_x:null,
    center_y:null,
    start_x:null,
    start_y:null,
    score:0,
    ctor:function(row, column, layer){
        this.row_num = row;
        this.column_num = column;
        this.bricks = [];
        this.center_x = cc.winSize.width/2;
        this.center_y = cc.winSize.height/2;
        this.start_x =  this.center_x - (this.column_num/2-0.5) * this.brick_gap;
        this.start_y =  this.center_y - (this.row_num/2-0.5) * this.brick_gap;
        for(var i = 0; i< this.row_num;i++ ){
           var line = [];
           for(var j= 0; j< this.column_num; j++){
               var brick = new Brick(i, j);
               layer.addChild(brick, 2);
               brick.attr({x:this.start_x+ j*this.brick_gap,y:this.start_y+i*this.brick_gap});
               line.push(brick);
           }
           this.bricks.push(line);
        }
        //here sleep 1 for first show all brick has action, must wait
        //then after create brick, if some can remove, it's remove action can gap with create action
        this.CheckAllLoop(1);
    },
    PosToBrick:function(pos){
        var x= pos.x;
        var y= pos.y;
        var x_index = (x + 0.5*this.brick_gap - this.start_x)/this.brick_gap;
        var y_index = (y + 0.5*this.brick_gap - this.start_y)/this.brick_gap;

        if(x_index < 0 || x_index >= this.column_num){
            x_index = -1;
        }
        if(y_index < 0 || y_index >= this.column_num){
            y_index = -1;
        }
        return {x:Math.floor(x_index) , y:Math.floor(y_index)};
    },
    Switch:function(pos1, pos2) {
        var brick1 = this.bricks[pos1.y][pos1.x];
        var brick2 = this.bricks[pos2.y][pos2.x];
        var texture1 = brick1.getTexture();
        var texture2 = brick2.getTexture();
        var color1 = brick1.colorType;
        var color2 = brick2.colorType;
//unused code, because moveto actually change two sprite, need not to reset color
//        var change =  function(obj, data){
//            var brick = data.brick;
//            var texture= data.texture;
//            var color= data.color;
//            brick.setTexture(texture);
//            brick.colorType = color;
//            cc.log(brick.colorType +"->" + color);
//        }
//        var change1 = new cc.CallFunc(change, this, {brick:brick1, texture:texture2, color:color2});
//        var change2 = new cc.CallFunc(change, this, {brick:brick2, texture:texture1, color:color1});
//        brick1.runAction(cc.sequence(cc.moveTo(0.5, cc.p(brick2.x, brick2.y)) ), change1);
//        brick2.runAction(cc.sequence(cc.moveTo(0.5, cc.p(brick1.x, brick1.y)) ), change2);

        var switchCheckAfterMove = function(obj, args){
            var brick1 = args.brick1;
            var brick2 = args.brick2;
            var first = args.first;
            //swift two brick in bricks because has already move to each other
            var row_temp = brick1.row;
            brick1.row = brick2.row;
            brick2.row = row_temp;
            var column_temp = brick1.column;
            brick1.column = brick2.column;
            brick2.column = column_temp;

            this.bricks[brick1.row][brick1.column] = brick1;
            this.bricks[brick2.row][brick2.column] = brick2;
            //revert move, not check
            if(!first){
                return ;
            }
            //first move,after swift action finished, check
            var success = this.CheckAllLoop(0);
            if(success == 0){
                //move failed, revert two brick, move back and restore two brick in bricks's array
                var call_back_switch_check_failed = cc.callFunc(switchCheckAfterMove, this, {brick1:brick1, brick2:brick2, first:false});
                brick1.runAction(cc.sequence(cc.moveTo(0.5, cc.p(brick2.x, brick2.y)), call_back_switch_check_failed));
                brick2.runAction(cc.moveTo(0.5, cc.p(brick1.x, brick1.y)));
            }
        };
        var call_back_switch_check = cc.callFunc(switchCheckAfterMove, this, {brick1:brick1, brick2:brick2, first:true});
        //first move , after move check is available
        brick1.runAction(cc.sequence(cc.moveTo(0.5, cc.p(brick2.x, brick2.y)), call_back_switch_check));
        brick2.runAction(cc.moveTo(0.5, cc.p(brick1.x, brick1.y)));
    },
    /**
     *
     * @param waitTime(action waitTime)
     * when game start ,it should be more than 0, for
     * @returns {number}
     * @constructor
     */
    CheckAllLoop:function(waitTime){
        var checkTimes = 0;
        while(this.CheckAll(waitTime) > 0){
            checkTimes ++;
            waitTime += 0.5;
        }
        return checkTimes;
    },
    /**
     *
     * @param checkTimes:sleep time before action run, this value make different remove action different happen
     *  for a, b, c remove, and create d,e,f replace a,b,c and it happened d,e,f remove again,so this second remove
     *  action sleep 1s more than first remove action
     * @returns {number}
     * @constructor
     */
    CheckAll:function(waitTime){
        cc.log("check once");
        var removeCount = 0;
        for(var i = 0; i< this.row_num; i++){
            var sameNum = 0;
            var lastColor = -1;
            for(var j = 0; j< this.column_num; j++){
                var thisColor = this.bricks[i][j].colorType;
                if(j == 0){
                    sameNum +=1;
                    lastColor = thisColor;
                }else if (thisColor === lastColor){
                    sameNum ++;
                }else{
                   if(sameNum >= 3) {
                       for (var k = 0; k < sameNum; k++) {
                           //this.bricks[i][j-1-k].setTexture(res.brick_null_png);
                           this.bricks[i][j-1-k].remove = true;
                       }
                       this.PlayClean();
                   }
                   lastColor = thisColor;
                   sameNum = 1;
                }
            }
            if(sameNum >=3){
                for (var k = 0; k < sameNum; k++) {
                    //this.bricks[i][this.column_num-1-k].setTexture(res.brick_null_png);
                    this.bricks[i][j-1-k].remove = true;
                    this.PlayClean();
                }
            }
        }
        for(var i = 0; i< this.column_num; i++){
            var sameNum = 0;
            var lastColor = -1;
            for(var j = 0; j< this.row_num; j++){
                var thisColor = this.bricks[j][i].colorType;
                if(j == 0){
                    sameNum +=1;
                    lastColor = thisColor;
                }else if (thisColor === lastColor){
                    sameNum ++;
                }else{
                    if(sameNum >= 3) {
                        for (var k = 0; k < sameNum; k++) {
                            //this.bricks[i][j-1-k].setTexture(res.brick_null_png);
                            this.bricks[j-1-k][i].remove = true;
                        }
                        this.PlayClean();
                    }
                    lastColor = thisColor;
                    sameNum = 1;
                }
            }
            if(sameNum >=3){
                for (var k = 0; k < sameNum; k++) {
                    //this.bricks[i][this.column_num-1-k].setTexture(res.brick_null_png);
                    this.bricks[j-1-k][i].remove = true;
                    this.PlayClean();
                }
            }
        }
        for(var i = 0; i< this.row_num; i++){
            for(var j = 0; j< this.column_num; j++) {
                if(this.bricks[i][j].remove == true){
                    this.bricks[i][j].ReColor({color:undefined, time:0.5, oldColor:this.bricks[i][j].colorType, waitTime:waitTime});
                    removeCount ++;
                    this.score ++;
                    cc.log("score +1");
                }
            }
        }
        return removeCount;
    },
    CheckPos:function(pos1){
    },
    PlayClean:function(){
        cc.audioEngine.setEffectsVolume(0.3);
        cc.audioEngine.playEffect(res.brick_clean_mp3, false);
    },
    ReColorAll:function(){
        for(var i = 0; i< this.row_num; i++) {
            for (var j = 0; j < this.column_num; j++) {
                this.bricks[i][j].ReColor({color:undefined , time:0});
            }
        }
    },
    ShowAll:function(){
        var bricks = this.bricks;
        for(var i in bricks){
            var line = bricks[bricks.length -1 - i];
            var line_log = "";
            for(var j in line){
                var brick = line[j];
                line_log += "("+brick.row + ","+brick.column +"," +Bricks.Color[brick.colorType]+")";
            }
            cc.log(line_log);
        }
    }
});
Bricks.Color=[
   "empty",
    "yellow",
    "red",
    "green",
    "blue",
    "orange",
    "pink"
]
Bricks.ColorRes = [
    res.brick_null_png,
    res.brick_yellow_png,
    res.brick_red_png,
    res.brick_green_png,
    res.brick_blue_png,
    res.brick_orange_png,
    res.brick_pink_png
];
