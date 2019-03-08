// Initialize app
var myApp = new Framework7();


// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function(){

      var myLocation = localStorage.getItem("location");
        if(myLocation == null){
            myLocation = "Vancouver, Ca";
        }
//***** GET WEATHER FOR THIS CITY, IE VICTORIA, BC *****
    $.ajax({
        method: "get",
        url: "http://api.openweathermap.org/data/2.5/weather?q="+ myLocation +"&units=metric&APPID=3be108085fa1ad74baf1af3d3e9af389",
        dataType: "json"    
    }).done(function(response){
        console.log(response);
        assignWeather(response.weather[0].id); 
        $('#date').html(getDate());
        $('#location').html(response.name);
        $('#temp').html(float2int(response.main.temp)+" °C");
        $('#description').html(response.weather[0].description);
    });
    
//***** GET THE FORECAST FOR THE CURRENT CITY, IE VANCOUVER, BC *****
    $.ajax({
        method: "get",
        url: "http://api.openweathermap.org/data/2.5/forecast?q="+ myLocation +"&units=metric&APPID=3be108085fa1ad74baf1af3d3e9af389",
        dataType: "json"    
    }).done(function(response){
        console.log(response);
        
        var minTemp = [50,50,50,50,50];
        var maxTemp = [-50,-50,-50,-50,-50];
        var weatherId= [];
        var count = 0;
        for(var i=0; i<5;i++){
            
            for(var j=count; j<(count + 8); j++){
                
                if(minTemp[i] > response.list[j].main.temp_min){
                    minTemp[i] = float2int(response.list[j].main.temp_min);
                }                
                if(maxTemp[i] < response.list[j].main.temp_max){
                    maxTemp[i] = float2int(response.list[j].main.temp_max);
                }
                if(j == 4 || j == 12 || j == 20 || j == 28 || j == 36){
                    weatherId[i] = response.list[j].weather[0].icon;
                    console.log(j + weatherId[i]);
                }  
            }
            count+=8;
        }
        console.log(weatherId);
        for(var i=0; i<minTemp.length; i++){
            var forcast = "<span style='color: red'>High: " + maxTemp[i] + "°C<br></span><span style='color: blue'> Low: " + minTemp[i]+ "°C</span>";
            var icon = weatherId[i];
            var dayIcon = icon.replace("n", "d");
            var iconUrl = "http://openweathermap.org/img/w/" + dayIcon + ".png";
            var date = getDateFore(i);
            $('#fcT'+i).html(date);
            $('#fcI'+i).attr("src", iconUrl);
            $('#fc'+i).html(forcast);
        }
    });
    
document.addEventListener('deviceready', inAppbrowser, false);
    
function inAppbrowser(){

    
    $$('#mysite').on('touchend', function(){
    var optionsArray =[ 
                // For all OS's
				'location=no',
				
				// For Android, iOS & Windows Phone only
				'hidden=yes',
				
				// Android and iOS only
				'clearcache=yes',
				'clearsessioncache=yes',
				
				// iOS only
				// Transition style options are fliphorizontal, crossdissolve or coververtical (Default)
				'transitionstyle=fliphorizontal',
				'toolbar=yes',
				'closebuttoncaption=Exit',
				// Tool bar position options are top or bottom (Default)
				'toolbarposition=top',
				'disallowoverscroll=yes',
				'enableViewportScale=yes',
				'mediaPlaybackRequiresUserAction=yes',
				'allowInlineMediaPlayback=yes',
				'keyboardDisplayRequiresUserAction=no',
				'suppressesIncrementalRendering=yes',
				// Presentation style options are pagesheet, formsheet or fullscreen (Default)
				'presentationstyle=formsheet',

				// Android only
				'zoom=no',
				'hardwareback=no',
				
				// Windows only
				// If location is set to no there be no control presented to user to close IAB window.
				'fullscreen=yes' ];    
    
    var options = optionsArray.join();     
   var jbroswer = window.open('http://smallworldwebdevelopment.com/', '_blank', options);  jbroswer.show();  
    });
    
    
}      
    
    
    
});

function assignWeather(weatherState){
    switch(true) {
        case (weatherState <= 502)://LIGHT RAINY 502
            removeAllclasses()
            $('#mainPage').addClass("page-content-lightrain");
            $('#leftPanel').addClass("page-content-lightrain");
            $('#aboutPage').addClass("page-content-lightrain");
            $('.birds').css("display", "none");
            break;
        case (weatherState <= 531)://RAINY 531
            removeAllclasses()
            $('#mainPage').addClass("page-content-rainy");
            $('#leftPanel').addClass("page-content-rainy");
            $('#aboutPage').addClass("page-content-rainy");
            $('.birds').css("display", "none");
            break;
        case (weatherState == 800)://CLEAR 800
            removeAllclasses()
            $('#mainPage').addClass("page-content-clear");
            $('#leftPanel').addClass("page-content-clear");
            $('#aboutPage').addClass("page-content-clear");
            $('.weatherHeader').css("color", "black");
            for(var i=1;i<=5;i++){
                $('#cld'+i).css("display", "none");
            };
            $('.overcast').css("display", "none");
            $('.rain').css("display", "none");
            break;
        case (weatherState <= 802)://SUN & ClOUD 801
            removeAllclasses()
            $('#mainPage').addClass("page-content-suncloud");
            $('#leftPanel').addClass("page-content-suncloud");
            $('#aboutPage').addClass("page-content-suncloud");
            $('.weatherHeader').css("color", "black");
            $('.overcast').css("display", "none");
            $('.rain').css("display", "none");
            break;
        case (weatherState <= 803)://SCATTERED CLOUDS 803
            removeAllclasses()
            $('#mainPage').addClass("page-content-scatteredClouds");
            $('#leftPanel').addClass("page-content-scatteredClouds");
            $('#aboutPage').addClass("page-content-scatteredClouds");
            $('.weatherHeader').css("color", "black");
            $('.rain').css("display", "none");
            
            
            break;
        case (weatherState <= 804)://OVERCAST 804
            removeAllclasses()
            $('#mainPage').addClass("page-content-overcast");
            $('#leftPanel').addClass("page-content-overcast");
            $('#aboutPage').addClass("page-content-overcast");
            $('.birds').css("display", "none");
            $('.rain').css("display", "none");
            break;
        default:
        // code block
    }     
}

function removeAllclasses(){
    $('#mainPage').removeClass("page-content-lightrain");
    $('#mainPage').removeClass("page-content-rainy");
    $('#mainPage').removeClass("page-content-clear"); 
    $('#mainPage').removeClass("page-content-suncloud"); 
    $('#mainPage').removeClass("page-content-overcast");
    
    $('#leftPanel').removeClass("page-content-lightrain");
    $('#leftPanel').removeClass("page-content-rainy");
    $('#leftPanel').removeClass("page-content-clear"); 
    $('#leftPanel').removeClass("page-content-suncloud"); 
    $('#leftPanel').removeClass("page-content-overcast");
     
}

function getDate(){
    var j = new Array( "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun" );
    var i = new Array( "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec");

    var d = new Date();
    return (j[d.getDay() - 1]) + ", " +  (i[d.getMonth()]) + " " + d.getDate();
}

function getDateFore(count){
    
        
    var i = new Array( "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec");
    var d = new Date();
    d.setDate(d.getDate() + count);        
    return (i[d.getMonth()]) + " " + d.getDate();
        
    
}

function float2int (value) {
    return value | 0;
}

$("#locationForm").submit(function(e) {
    var mylocation = $("#myLocation").val();
    localStorage.setItem("location", mylocation);
    
});

// Option 1. Using page callback for page (for "about" page in this case) (recommended way):
myApp.onPageInit('about', function (page) {
    // Do something here for "about" page

})

// Option 2. Using one 'pageInit' event handler for all pages:
$$(document).on('pageInit', function (e) {
    // Get page data from event data
    var page = e.detail.page;

    if (page.name === 'about') {
        // Following code will be executed for page with data-page attribute equal to "about"
        myApp.alert('Here comes About page');
    }
})

// Option 2. Using live 'pageInit' event handlers for each page
$$(document).on('pageInit', '.page[data-page="about"]', function (e) {
    // Following code will be executed for page with data-page attribute equal to "about"
    myApp.alert('Here comes About page');
})