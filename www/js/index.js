/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var browser = null
var currentURL = "https://www.freizeitticket.info/app.html";

function isFreizeitticket(url){
    if ( url.indexOf("http://freizeitticket.info") !== -1 ||
         url.indexOf("https://freizeitticket.info") !== -1 ||
         url.indexOf("http://www.freizeitticket.info") !== -1 ||
         url.indexOf("https://www.freizeitticket.info") !== -1 ||
         url.indexOf("error.html") !== -1){
        return true;
    }
    return false;
}

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener("resume", this.onDeviceResume, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.startApp();
    },
    onDeviceResume: function(){
        if (cordova.platformId != 'android'){
            window.plugins.PushbotsPlugin.resetBadge();
        }
        browser = app.getBrowser()
    },
    startApp:function(){
        app.initPushbots()
        browser = app.getBrowser()
    },
    initPushbots: function (){
        if (cordova.platformId == 'android'){
            localStorage.setItem('platform', 'android');
        }else{
            localStorage.setItem('platform', 'ios');
        }
        window.plugins.PushbotsPlugin.initialize("581226b14a9efa67818b4567", {"android":{"sender_id":"576354300081"}});

    },
    addEvents: function (browser){
        browser.addEventListener('exit', function (){
            navigator.app.exitApp();
        });

        browser.addEventListener('loadstart', function (e){
            if (!isFreizeitticket(e.url)){
                window.open(e.url, '_system', '');
            }else{
                currentURL = e.url;
            }
        });

        return browser;
    },
    getBrowser: function (url){
        if (url){
            browser = cordova.InAppBrowser.open("error.html", "_blank", "location=no,zoom=no,toolbar=no");
        }else{
            browser = cordova.InAppBrowser.open(currentURL, '_blank', "location=no,zoom=no,toolbar=no");
        }
        browser = app.addEvents(browser);
        browser.addEventListener('loaderror', function (){
            app.getBrowser("error");
            currentURL = "https://www.freizeitticket.info/app.html";
        });
        return browser;
    }
};
