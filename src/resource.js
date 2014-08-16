var res = {
    HelloWorld_png : "res/HelloWorld.png",
    CloseNormal_png : "res/CloseNormal.png",
    CloseSelected_png : "res/CloseSelected.png",
    hero_png:"res/PaperPlane.png",
    enemy_small_png:"res/PaperPlaneSmall.png",
    GodPlane_png:"res/GodPlane.png",
    LXPlane_png:"res/LXPlane.png",
    XPlane_png:"res/XPlane.png",
    bullet_png:"res/bullet.png",
    back_png:"res/sky.png",
    back_music:"res/back.mp3"
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}