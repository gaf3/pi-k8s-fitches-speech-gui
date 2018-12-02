window.DRApp = new DoTRoute.Application();

DRApp.load = function (name) {
    return $.ajax({url: name + ".html", async: false}).responseText;
}

DRApp.rest = function(type,url,data,success,error,complete) {

    var response = $.ajax({
        type: type,
        url: url,
        contentType: "application/json",
        data: (data === null) ? null : JSON.stringify(data),
        dataType: "json",
        success: success,
        error: error,
        complete: complete,
        async: (success != null || error != null || complete != null)
    });

    if (success != null || error != null || complete != null) {
        return;
    }

    //alert(response.status);

    if ((response.status != 200) && (response.status != 201) && (response.status != 202)) {
        throw new Exception(type + ": " + url + " failed",response);
    }

    return response.responseJSON;

}

DRApp.controller("Base",null,{
    home: function() {
        DRApp.rest("GET","/api/setting",null,$.proxy(this.home_data,this));
    },
    home_data(data) {
        this.it = {
            values: {
                node: '',
                text: '',
                language: ''
            },
            settings: data.settings
        };
        this.application.render(this.it);
    },
    speak: function() {
        data = {
            node: $("#node").val(),
            text: $("#text").val(),
            language: $("#language").val(),
        }
        DRApp.rest("POST","/api/speak",data,$.proxy(this.speak_data,this));
    },
    speak_data(data) {
        this.it.values = data.message;
        this.application.render(this.it);
    },
});

DRApp.partial("Header",DRApp.load("header"));
DRApp.partial("Footer",DRApp.load("footer"));

DRApp.template("Home",DRApp.load("home"),null,DRApp.partials);

DRApp.route("home","/","Home","Base","home");
