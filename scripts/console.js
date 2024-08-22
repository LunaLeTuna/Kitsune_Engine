// var crosshair = create_menu_image()
// var crosshairtexture = new Texture("crosshair.png");
// mod_menu_scale(crosshair, new Vector2(0.02, 0.02))
// create_menu_image_texture(crosshair, crosshairtexture.ID)

var blur_shader = new Shader("ui/blur")

var console_background = create_menu_image()
mod_menu_render(console_background, false)
mod_menu_pos(console_background, new Vector2(0.0, 1.0))
mod_menu_scale(console_background, new Vector2(0.25, 0.15))
mod_menu_shader(console_background, blur_shader.ID)

function rp(x,y){
    mod_menu_scale(console_background, new Vector2(x, y))
}

var console_text = create_menu_text()
mod_menu_text_text(console_text, ``)
mod_menu_pos(console_text, new Vector2(-0.99, 0.93))
mod_menu_scale(console_text, new Vector2(0.3, 0.5))
mod_menu_render(console_text, false)

var console_input = create_menu_text()
mod_menu_text_text(console_input, ``)
mod_menu_pos(console_input, new Vector2(-0.99, 0.35))
mod_menu_render(console_input, false)

var isconsoleopen = false;
var log = "";
var currentcommand = "";
var shiftdown = false;
var cshistory = [];
var cshwhere = 0;

const reallog = console.log;

console.log = function(...value){
    log+=`${value}\n`
    mod_menu_text_text(console_text, `${log}`)
    reallog(value)
    return "";
}

function clear(){
    log=""
    currentcommand=""
    mod_menu_text_text(console_text, `${log}`)
    return ""
}

addEventListener("keypress", (keyevt) => {
    //console.log(JSON.stringify(keyevt));

    if(keyevt.code == "Shift_L" || keyevt.code == "Shift_R"){ //ecscape
        if(keyevt.how=="pressed")
        shiftdown=true;
        else
        shiftdown=false;
        return;
    }

    if(keyevt.how!=="pressed") return;

    if(keyevt.which == 41){ //~ to open console
        if(!isconsoleopen){
            mod_menu_render(console_background, true)
            mod_menu_render(console_text, true)
            mod_menu_render(console_input, true)
            window_cursor_lock(false)
            LOCK_MOVEMENT=true;
            isconsoleopen=true;
        return;
        }
    }

    if(!isconsoleopen) return;

    if(keyevt.code == "space") keyevt.code = " "

    if(keyevt.code == "Escape"){ //ecscape
        mod_menu_render(console_background, false)
        mod_menu_render(console_text, false)
        mod_menu_render(console_input, false)
        window_cursor_lock(true)
        LOCK_MOVEMENT=false;
        isconsoleopen=false;
        return;
    }
    if(keyevt.code == "BackSpace"){
        currentcommand = currentcommand.slice(0,currentcommand.length-1)
        mod_menu_text_text(console_text, `${log}`)
        mod_menu_text_text(console_input, `${currentcommand}`)
        return;
    }
    if(keyevt.code == "Return"){ //enter
        //log+=`${currentcommand}\n`
        try {
            let outputy = (eval(currentcommand)) || "";
            log+=`${outputy}\n`
            currentcommand=""
            mod_menu_text_text(console_text, `${log}`)
            mod_menu_text_text(console_input, `${currentcommand}`)
        } catch (error) {
            log+=`${error}\n`
            currentcommand=""
            mod_menu_text_text(console_text, `${log}`)
            mod_menu_text_text(console_input, `${currentcommand}`)
        }
        
        return;
    }
    
    {

        let finalputdown = keyevt.code;


        if(!"ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789=-[]\\,./;'\"`".includes(keyevt.code))
        return;

        if(!shiftdown && "ABCDEFGHIJKLMNOPQRSTUVWXYZ".includes(keyevt.code)){
            finalputdown = keyevt.code.toLowerCase()
        }

        if(shiftdown && " 0123456789=-[]\\,./;'\"`".includes(keyevt.code)){
            let ind = " 0123456789=-[]\\,./;'\"`".indexOf(keyevt.code)
            finalputdown = " )!@#$%^&*(+_{}|<>?:\"~".charAt(ind) 
        }

        currentcommand += finalputdown

        mod_menu_text_text(console_input, `${currentcommand}`)
        return;
    }
    
})

