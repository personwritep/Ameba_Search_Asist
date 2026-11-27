// ==UserScript==
// @name        Ameba Search Asist
// @namespace        http://tampermonkey.net/
// @version        0.4
// @description        アメーバ検索の補助ツール　キー操作のみでリスト・ページ選択
// @author        Ameba Blog User
// @match        https://search.ameba.jp/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=ameblo.jp
// @grant        none
// @updateURL        https://github.com/personwritep/Ameba_Search_Asist/raw/main/Ameba_Search_Asist.user.js
// @downloadURL        https://github.com/personwritep/Ameba_Search_Asist/raw/main/Ameba_Search_Asist.user.js
// ==/UserScript==


setTimeout(()=>{
    if(document.querySelector('.YtZu3q_root')){ // 検索ページャーのある画面でのみ動作
        page_select(); }
}, 200);


function page_select(){
    let now;
    let now_u;
    let now_s;
    let q;
    let now_s_q;
    let now_s_pre;
    let now_s_next;
    let pre_url;
    let next_url;


    function get_pre_url(){
        now=location.href;
        now_u=now.split('?')[0];
        now_s=now.split('?')[1];

        if(now_s){
            now_s=now_s.replace('&sbs=0', '');
            q=now_s.split('&');
            for(let k=0; k<q.length; k++){
                if(q[k].indexOf('p=')!=-1){
                    now_s_q=q[k]; }}

            let now_page;
            if(now_s_q){
                now_page=now_s_q.substr(2);

                if(now_page/1==1){
                    now_s_pre='p=1'; }
                else{
                    now_s_pre='p='+ (now_page/1 -1); }
                if(now_s_pre){
                    for(let k=0; k<q.length; k++){
                        if(q[k].indexOf('p=')!=-1){
                            q[k]=now_s_pre; }}
                    pre_url=now_u +'?'+ q.join('&'); }}
            else{
                pre_url=now +'&p=1'; }}
        else{
            pre_url=now +'?p=1'; }

    } // get_pre_url()


    function get_next_url(){
        now=location.href;
        now_u=now.split('?')[0];
        now_s=now.split('?')[1];

        if(now_s){
            now_s=now_s.replace('&sbs=0', '');
            q=now_s.split('&');
            for(let k=0; k<q.length; k++){
                if(q[k].indexOf('p=')!=-1){
                    now_s_q=q[k]; }}

            let now_page;
            if(now_s_q){
                now_page=now_s_q.substr(2);

                if(now_page/1==100){
                    now_s_next='p=100'; }
                else{
                    now_s_next='p='+ (now_page/1 +1); }
                if(now_s_next){
                    for(let k=0; k<q.length; k++){
                        if(q[k].indexOf('p=')!=-1){
                            q[k]=now_s_next; }}
                    next_url=now_u +'?'+ q.join('&'); }}
            else{
                next_url=now +'&p=1'; }}
        else{
            next_url=now +'?p=1'; }

    } // get_next_url()



    document.addEventListener("keydown", check_arrow);
    function check_arrow(event){
        if(event.keyCode==37){ //「⇦」
            if(is_able()){
                event.preventDefault();
                go_pre(); }}
        if(event.keyCode==39){ //「⇨」
            if(is_able()){
                event.preventDefault();
                go_next(); }}
        if(event.keyCode==38){ //「⇧」
            if(is_able()){
                event.preventDefault();
                select_up(); }}
        if(event.keyCode==40){ //「⇩」
            event.preventDefault();
            to_able();
            select_down(); }

        if(event.keyCode==13){ //「Enter」
            if(is_able()){
                event.preventDefault();
                select_open(event); }}

        if(event.keyCode==27){ //「ESC」
            if(is_able()){
                clear_select(); }}}


    function go_pre(){
        if(go_check(0)){
            get_pre_url();
            if(pre_url){
                location.href=pre_url; }}}


    function go_next(){
        if(go_check(1)){
            get_next_url();
            if(next_url){
                location.href=next_url; }}}


    function go_check(n){
        if(n==0){
            let edge=document.querySelector('.YtZu3q_more-link .s-triangle-left');
            if(edge){
                return true; }
            else{
                return false; }}
        if(n==1){
            let edge=document.querySelector('.YtZu3q_more-link .s-triangle-right');
            if(edge){
                return true; }
            else{
                return false; }}}


    let order=-1;
    let items=document.querySelectorAll('.jJf5Iq_root');


    function select_up(){
        if(order>0){
            for(let k=0; k<items.length; k++){
                items[k].style.outline=''; }
            order=order-1;
            items[order].style.outline='2px solid red'; }}


    function select_down(){
        if(order<items.length-1){
            for(let k=0; k<items.length; k++){
                items[k].style.outline=''; }
            order=order+1;
            items[order].style.outline='2px solid red'; }}


    function select_open(event){
        for(let k=0; k<items.length; k++){
            if(items[k].style.outlineWidth=='2px'){
                let link=items[k].querySelector('a');
                if(link){
                    if(!event.ctrlKey || !event.shiftKey){
                        link.click(); }
                    else if(event.ctrlKey && !event.shiftKey){
                        link.dispatchEvent(ctrlClickEvent); }
                    else if(!event.ctrlKey && event.shiftKey){
                        link.dispatchEvent(shiftClickEvent); }}}}

        //「Ctrl+Click」イベントを生成
        let ctrlClickEvent=new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            ctrlKey: true });

        //「Shift+Click」イベントを生成
        let shiftClickEvent=new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            shiftKey: true });

    } // select_open()


    let s_input=document.querySelector('.whCgtW_input');
    if(s_input){
        s_input.onclick=function(){
            clear_select(); }}


    function clear_select(){
        for(let k=0; k<items.length; k++){
            items[k].style.outline=''; }}


    function is_able(){
        let s_input=document.querySelector('.whCgtW_input');
        if(s_input && s_input==document.activeElement){
            return false; }
        else{
            return true; }}


    function to_able(){
        let s_input=document.querySelector('.whCgtW_input');
        if(s_input && s_input==document.activeElement){
            s_input.blur(); }}



    let help=
        '<div id="help_min_button">H</div>'+
        '<div id="astool_help">'+
        '<div class="upper">'+
        '<p class="t">Ameba検索画面</p>'+
        '<P>⇦　⇨：リストを移動</p>'+
        '<p>⇩　⇧：記事の選択</p>'+
        '<p>Enter ：選択記事を開く</p>'+
        '<p class="t">ブラウザのタブ</p>'+
        '<p>Ctrl+Tab：タブを変更</p>'+
        '<p>Ctrl+W：タブを閉じる</p>'+
        '</div>'+
        '<p class="lower">Search Asist'+
        '<span class="open_help">？</span></p>'+
        '<style>'+
        '#astool_help { position: fixed; top: 137px; left: calc(50% - 560px); '+
        'font: normal 14px Meiryo UI; text-align: left; width: 154px; '+
        'border: 1px solid #aaa; background: #fff; } '+
        '.upper p { padding: 2px 0 3px 6px; } '+
        '.upper p.t { padding: 2px 16px 3px; margin: 3px 0 2px; background: #eee; } '+
        '.lower { padding: 2px 10px; color: #fff; background: #bcbfc3; text-align: center; } '+
        '.open_help { display: inline-block; height: 16px; padding: 1px 2px 1px 1px; '+
        'margin-left: 12px; vertical-align: -1px; font: bold 16px/18px Meiryo; color: #fff; '+
        'border-radius: 30px; background: #666; cursor: pointer; } '+
        '#help_min_button { position: fixed; top: 104px; left: calc(50% - 400px); '+
        'font: bold 14px Meiryo; padding: 0 5px; height: 21px; color: #fff; '+
        'border-radius: 50px; background: #666; cursor: pointer; }'+
        '</style></div>';

    if(!document.querySelector('#astool_help')){
        document.body.insertAdjacentHTML('beforeend', help); }


    let help_min=document.querySelector('#help_min_button');
    let asa_help=document.querySelector('#astool_help');
    if(help_min && asa_help){
        let help_s=sessionStorage.getItem('ASA_hs');
        if(!help_s){
            help_s=1;
            sessionStorage.setItem('ASA_hs', 1); }

        if(help_s==1){
            asa_help.style.display='block'; }
        else{
            help_s=0;
            asa_help.style.display='none'; }

        help_min.onclick=()=>{
            if(help_s==1){
                help_s=0;
                asa_help.style.display='none'; }
            else{
                help_s=1;
                asa_help.style.display='block'; }
            sessionStorage.setItem('ASA_hs', help_s); }}

    open_help();

} // page_select()



function open_help(){
    let help_url="https://ameblo.jp/personwritep/entry-12885223239.html" // 🔵🔵
    let help_option="top=0, left=0, width=800, height=800, noopener"
    let help=document.querySelector('.open_help');
    if(help){
        help.onclick=function(){
            window.open(help_url, null, help_option); }}}
