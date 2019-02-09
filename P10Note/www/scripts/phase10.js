$(document).ready(function () {

    var devMode = false;

    var root = null;
    var useHash = true; // Defaults to: false
    var hash = '#'; // Defaults to: '#'
    var router = new Navigo(root, useHash, hash);

    var players = new Array();
    var phases = new Array();
    var gameStarted = false;
    var savegame = false;
    var hasSavegame = false;
    var gameInfo = new Object();


    initGame();


    function initGame()
    {
        if (phases.length < 1) {
            generatePhaseCards();
        }

        savegame = checkLocalStorage();
        hasSavegame = checkSaveGame();
        

        if (!hasSavegame) {
            $('#game-continue-button').hide();
        }

        console.log("init()");
        console.log(phases.length+" Phases loaded");
    }

    router.on(function () {

        players = new Array();
        gameStarted = false;
        initGame();

        if (!devMode)
        {
            $('#game-settings-wrapper').hide();
            $('#player-settings-wrapper').hide();
            $('#dealer-settings-wrapper').hide();
            $('#game-card-setting-wrapper').hide();
            $('#edit-round-wrapper').hide();
            $('#finish-form').hide();
            $('#game-field-wrapper').hide();
            $('#user-rounds-wrapper').hide();
            $('.game-wrapper').hide();
        }

        $('#game-welcome-wrapper').show();
        $('#welcome-card').show();

    }).resolve();


    if (devMode === true) {
        $('#game-settings-wrapper').show(500);
        $('#player-settings-wrapper').show(500);
        $('#dealer-settings-wrapper').show(500);
        $('#game-card-setting-wrapper').show(500);
        $('#edit-round-wrapper').show(500);
        $('#finish-form').show(500);
        $('#game-field-wrapper').show(500);
        $('#user-rounds-wrapper').show(500);
    }

    function showMessage(message) {
        $('#darkscreen').show();
        $('#window-wrapper').show(100);
        $('#window-message').html(message);
        $('.window-button').hide();
        $('#ok-button').show();
    }

    $('.window-button').click(function () {
        $('#darkscreen').hide();
        $('#window-wrapper').hide(100);
    });

    setInterval(function () {
        checkBackBtn();
    }, 500);

    function checkBackBtn() {
        if (!devMode) {
            if ($("#game-field-wrapper").is(":visible") === false)
            {
                $("#global-back-btn").show();
                $("#finish-round").hide();
                $("#edit-last").hide();
            }
            else
            {
                $("#global-back-btn").hide();
                $("#finish-round").show();
                $("#edit-last").show();
            }
        }
        else {
            $("#global-back-btn").show();
            $("#finish-round").show();
            $("#edit-last").show();
        }
    }

    $("#global-back-btn").click(function () {
        history.back();
        /*$(".game-wrapper").hide(500);
        $("#game-field-wrapper").show(500);*/
    });


    //Neues Spiel Button
    $('#new-game-button').click(function () {
        router.navigate('gamesettings');
    });

    //Spiel fortsetzen Button
    $('#game-continue-button').click(function () {
        router.navigate('gamefield');
    });

    //Anzahl der Spieler festlegen (Playersettings)
    $('#set-num-players-button').click(function () {
        if (getNumberOfPlayers() > 1)
        {
            router.navigate('playersettings');
        }
        else
        {
            showMessage("Es müssen mindestens 2 Spieler teilnehmen");
        }
        
    });

    //Spiel (Phasenkarte) auswählen (gamecardselection)
    $('#choose-card-next-btn').click(function () {
        router.navigate('gamecardselection');
    });

    //Dealer auswählen (dealerselection)
    $('#dealer-next-btn').click(function () {
        router.navigate('dealerselection');
    });

    //Spiel starten (gamefield)
    $('#start-game-btn').click(function () {
        router.navigate('gamefield');
    });




    //Anzahl der Spieler festlegen
    router.on('gamesettings', function () {
        if (savegame === true) {
            localStorage.clear();
            hasSavegame = false;
        }
        if (devMode === false) {
            $('.game-wrapper').hide(500);
            $('#game-settings-wrapper').show(500);
        }
    }).resolve();


    //Namen der Spieler eingeben
    router.on('playersettings', function () {

        if (getNumberOfPlayers() < 2)
        {
            console.log("Routed from 'playersettings' to 'gamesettings' because the number of required players is too small.");
            showMessage("Es müssen mindestens 2 Spieler teilnehmen");
            router.navigate('gamesettings');
        }
        else
        {
            setNumOfPlayers(getNumberOfPlayers());
        }
        
    }).resolve();

    //Legt die Anzahl der Spieler fest und erstellt das UI zur Namenseingabe
    function setNumOfPlayers($num) {
        var num_players = $num;
        var playersettings = "";

        if (num_players > 1)
        {
            for (var i = 0; i < num_players; i++)
            {
                var player = new Object();
                player["name"] = "";
                player["points"] = 0;
                player["last_points"] = 0;
                player["phase"] = 1;
                player["rounds"] = new Array(); //Hier werden alle gespielten Runden gespeichert
                player["dealer"] = null;

                players[i] = player;

                playersettings += `
                    <div>
                        <div class='player-name-input-text'>
                            <input type='text' class='player-name-input' id='player-name-` + i + `' placeholder='Spieler ` + (i + 1) + `'>
                        </div>
                    </div>`;

                players[i]['name'] = "Spieler "+ (i+1);

            }


            $('#player-name-input-wrapper').html(playersettings);

            $('.player-name-input').blur(function () {

                var playerId = $(this).attr('id').slice(-1);

                if (parseInt(playerId) > -1)
                {
                    console.log(playerId);
                    player_name = $('#player-name-' + playerId).val();

                    if (player_name === "")
                    {
                        player_name = $('#player-name-' + playerId).attr("placeholder");
                    }
                    
                    players[playerId]['name'] = player_name;
                    console.log(players[playerId]['name']);
                }
                

            });

            if (devMode === false)
            {
                $('.game-wrapper').hide(500);
                $('#player-settings-wrapper').show(500);
            }
            console.log(getNumberOfPlayers()+" Players");
        }
        else
        {
            showMessage("Es müssen mindestens 2 Spieler am Spiel teilnehmen.");
        }

        $('#num-players').val('');
    }


    //Spiel (Phasenkarte) auswählen
    router.on('gamecardselection', function ()
    {
        if (getNumberOfPlayers() > 1)
        {
            if (devMode === false) {
                $('.game-wrapper').hide(500);
                $('#game-card-setting-wrapper').show(500);
            }
        }
        else
        {
            console.log("Routed from dealerselection to Homepage because there're no players available");
            router.navigate();
        }
        console.log(getNumberOfPlayers() + " Players");

    }).resolve();

    //Dealer auswählen
    router.on('dealerselection', function ()
    {
        if ((getNumberOfPlayers() > 1) && typeof players[0]['name'] !== "undefined")
        {
            generateDealerInput();
            if (devMode === false) {
                $('.game-wrapper').hide(500);
                $('#dealer-settings-wrapper').show(500);
            }
        }
        else
        {
            console.log("Routed from dealerselection to Homepage because there're no players available");
            router.navigate();
        }

    });

    //Erzeugt das UI zum Auswählen des Dealers
    function generateDealerInput() {
        var numPlayers = 0;

        numPlayers = getNumberOfPlayers();
        var dealerdata = "";

        for (var i = 0; i < numPlayers; i++) {
            player_name = players[i]['name'];

            dealerdata += `
                <div class="dealer-choose" data-dealer-id=` + i + `>
                    <div class="dealer-name">` + player_name + `</div>
                </div>`;
        }

        $('#dealer-name-wrapper').html(dealerdata);
        $('#dealer-name-wrapper').append("<div class=\"clearfix\"></div>");

        $('.dealer-choose').click(function () {

            for (i = 0; i < getNumberOfPlayers(); i++)
            {
                players[i]['dealer'] = false;
            }

            dealerId = $(this).attr('data-dealer-id');
            $('#dealer-id').val(dealerId);
            players[dealerId]['dealer'] = true;
            checkDealerSelection();
            $(this).addClass('phase-selected');
        });
    }



    //Spiel starten
    router.on('gamefield', function () {
        if (!gameStarted)
        {
            console.log('Savegame: ' + hasSavegame);

            if (!hasSavegame)
            {
                gameInfo["phaseCardId"] = $('#phase-card-id').val();
            }
            else
            {
                loadGame();
            }
        }

        createGameTable();
        gameStarted = true;
        save();
        
        if (devMode === false) {
            $('.game-wrapper').hide(500);
            $('#game-field-wrapper').show(500);
        }

        $('#game-control-wrapper').css('visibility', 'visible');
    }).resolve();


    //Todo: Outsource it to a fking JSON!!!
    function generatePhaseCards() {

        phases[0] = new Array();
        phases[0]["name"] = "Classic";
        phases[0]["phase"] = new Array();
        phases[0]["phase"][0] = "2 Drillinge";
        phases[0]["phase"][1] = "Drilling + Viererfolge";
        phases[0]["phase"][2] = "Vierling + Vierfolge";
        phases[0]["phase"][3] = "Siebenerfolge";
        phases[0]["phase"][4] = "Achterfolge";
        phases[0]["phase"][5] = "Neunerfolge";
        phases[0]["phase"][6] = "2 Vierlinge";
        phases[0]["phase"][7] = "7 Karten einer Farbe";
        phases[0]["phase"][8] = "Fünfling + Zwilling";
        phases[0]["phase"][9] = "Fünfling + Drilling";

        phases[1] = new Array();
        phases[1]["name"] = "Island Paradise";
        phases[1]["phase"] = new Array();
        phases[1]["phase"][0] = "Siebenerfolge";
        phases[1]["phase"][1] = "Zwilling + zwei Drillinge";
        phases[1]["phase"][2] = "Secherfolge + Zwilling";
        phases[1]["phase"][3] = "2 Zwillinge + Drilling";
        phases[1]["phase"][4] = "Sechserfolge + Drilling";
        phases[1]["phase"][5] = "2 Viererfolgen";
        phases[1]["phase"][6] = "3 Karten einer Farbe + Vierling";
        phases[1]["phase"][7] = "8 Karten einer Farbe";
        phases[1]["phase"][8] = "4 Karten einer Farbe + Fünfling";
        phases[1]["phase"][9] = "9 Karten einer Farbe";

        phases[2] = new Array();
        phases[2]["name"] = "Cocoa Canyon";
        phases[2]["phase"] = new Array();
        phases[2]["phase"][0] = "6 Karten einer Farbe";
        phases[2]["phase"][1] = "7 Karten einer Farbe";
        phases[2]["phase"][2] = "4 Karten einer Farbe + 5 Karten einer Farbe";
        phases[2]["phase"][3] = "2 Drillinge";
        phases[2]["phase"][4] = "Achterfolge";
        phases[2]["phase"][5] = "Neunerfolge";
        phases[2]["phase"][6] = "Vierling + Viererfolge";
        phases[2]["phase"][7] = "Folge aus 6 geraden oder ungeraden Karten";
        phases[2]["phase"][8] = "Vierling + Sechserfolge";
        phases[2]["phase"][9] = "Fünfling + Viererfolge";

        phases[3] = new Array();
        phases[3]["name"] = "Moonlight Drive-in";
        phases[3]["phase"] = new Array();
        phases[3]["phase"][0] = "Vierling + Zwilling";
        phases[3]["phase"][1] = "2 Drillinge";
        phases[3]["phase"][2] = "Siebenerfolge";
        phases[3]["phase"][3] = "Achterfolge";
        phases[3]["phase"][4] = "Zwilling + 2 Drillinge";
        phases[3]["phase"][5] = "Fünfling";
        phases[3]["phase"][6] = "Neunerfolge";
        phases[3]["phase"][7] = "Sechserfolge + 2 Zwillinge";
        phases[3]["phase"][8] = "Achterfolge + Zwilling";
        phases[3]["phase"][9] = "Sechserfolge + Vierling";

        phases[4] = new Array();
        phases[4]["name"] = "Savannah Sunset";
        phases[4]["phase"] = new Array();
        phases[4]["phase"][0] = "3 Karten einer Farbe + 3 Karten einer Farbe + 4 Karten einer Farbe";
        phases[4]["phase"][1] = "Dreierfolge in einer Farbe + 2 Zwillinge";
        phases[4]["phase"][2] = "7 Karten einer Farbe";
        phases[4]["phase"][3] = "2 Drillinge";
        phases[4]["phase"][4] = "Zwilling + 2 Drillinge";
        phases[4]["phase"][5] = "Fünfling";
        phases[4]["phase"][6] = "4 gerade oder ungerade Karten einer Fabe + 4 gerade oder ungerade Karten einer Fabe";
        phases[4]["phase"][7] = "Neunerfolge";
        phases[4]["phase"][8] = "Fünferfolge in einer Farbe + 2 Zwillinge";
        phases[4]["phase"][9] = "Sechserfolge in einer Farbe + Zwilling";

        phases[5] = new Array();
        phases[5]["name"] = "Mountain Vista";
        phases[5]["phase"] = new Array();
        phases[5]["phase"][0] = "Dreierfolge + 3 Zwillinge";
        phases[5]["phase"][1] = "Achterfolge";
        phases[5]["phase"][2] = "Neunerfolge";
        phases[5]["phase"][3] = "Dreierfolge in einer Farbe + Drilling";
        phases[5]["phase"][4] = "Zwilling + 2 Drillinge";
        phases[5]["phase"][5] = "Zwilling + Drilling + Vierling";
        phases[5]["phase"][6] = "4 Karten einer Farbe + 6 Karten einer Farbe";
        phases[5]["phase"][7] = "5 Karten einer Farbe + 5 Karten einer Farbe";
        phases[5]["phase"][8] = "Fünferfolge + Drilling + Zwilling";
        phases[5]["phase"][9] = "Dreierfolge + Vierling + Drilling";

        phases[6] = new Array();
        phases[6]["name"] = "Hell's Game";
        phases[6]["phase"] = new Array();
        phases[6]["phase"][0] = "Achterfolge";
        phases[6]["phase"][1] = "2 Vierlinge";
        phases[6]["phase"][2] = "Vierling + Fünfling";
        phases[6]["phase"][3] = "3 Drillinge";
        phases[6]["phase"][4] = "Neun Karten einer Farbe";
        phases[6]["phase"][5] = "Zehnerfolge";
        phases[6]["phase"][6] = "Fünferfolge in einer Farbe + Dreierfolge in einer Farbe";
        phases[6]["phase"][7] = "Sechsling"; 
        phases[6]["phase"][8] = "3 Zwillinge + Vierling";
        phases[6]["phase"][9] = "Fünferfolge in einer Farbe + Fünfling";

        phases[7] = new Array();
        phases[7]["name"] = "Blue Blood";
        phases[7]["phase"] = new Array();
        phases[7]["phase"][0] = "2 Zwillinge mit geraden + 2 Zwillinge mit ungeraden Zahlen";
        phases[7]["phase"][1] = "Vierling + 5 gerade oder ungerade Zahlen";
        phases[7]["phase"][2] = "Fünferfolge + Drilling + Zwilling";
        phases[7]["phase"][3] = "3 Dreierfolgen mit jeweils gleichen Farben";
        phases[7]["phase"][4] = "6 Karten einer Farbe + Drilling";
        phases[7]["phase"][5] = "Neunerfolge aus maximal zwei Farben";
        phases[7]["phase"][6] = "2 Vierlinge";
        phases[7]["phase"][7] = "3 Drillinge mit jeweils unterschiedlichen Farben";
        phases[7]["phase"][8] = "Fünferfolge + Fünfling";
        phases[7]["phase"][9] = "Sechsling + Drilling";


        var num_cards = phases.length;

        for (i = num_cards - 1; i >= 0; i--) {
            $('#gamecards-wrapper').prepend("<div class=\"phase-card-choose\" data-card-id=\"" + i + "\"><div class=\"phase-name left\">" + phases[i]["name"] + "</div><div class=\"show-card right\">i</div><div class=\"clearfix\"></div></div>");
        }
    }


    //Erzeugt eine Phasekarte und zeigt sie auf dem Bildschirm an. Es kann eine Phase farblich markiert werden.
    function createPhaseCard(cardId, phaseId = -1) {
        if (phases.length > 0)
        {
            $('#phase-card-hl').html("Die " + phases[cardId]['phase'].length + " Phasen");
            num_phases = phases[cardId]["phase"].length;

            $('#phase-card').html("");

            for (i = 0; i < num_phases; i++) {
                var phaseDone = (phaseId !== -1 && i < phaseId - 1) ? " phase-done" : "";
                var phaseActive = (phaseId !== -1 && i === phaseId - 1) ? " phase-active" : "";

                $('#phase-card').append("<tr class=\"phase-line " + phaseDone + phaseActive + "\"><td class=\"phase-line-num\">" + (i + 1) + ".)</td><td class=\"phase-line-desc\">" + phases[cardId]["phase"][i] + "</td></tr>");
            }
            $('#phase-card-wrapper').show(500);
        }
        else
        {
            console.log("There're no phases available - please run loadPhaseCards()");
        }

    }

    //Phasenkarte anzeigen (bei Kartenauswahl)
    $('.show-card').click(function () {
        cardId = $(this).parent().attr('data-card-id');
        $('#phase-card-id').val(cardId);
        createPhaseCard(cardId);
    });

    //Phasenkarte schließen
    $('#close-card').click(function () {
        $('#phase-card-wrapper').hide(500);
    });

    //Phasenkarte für das Spiel festlegen
    $('.phase-card-choose').click(function () {
        cardId = $(this).attr('data-card-id');
        $('#phase-card-id').val(cardId);
        checkPhaseSelection();
        $(this).addClass('phase-selected');
        gameInfo['phaseCardId'] = cardId;
    });

    //Phasenkarte des aktuellen Spiels anzeigen
    $('#phase-card-viewer').click(function () {
        cardId = gameInfo["phaseCardId"];
        createPhaseCard(cardId);
    });

    //UI Highlight für Phasecard Auswahl
    function checkPhaseSelection() {
        var cards = $('.phase-card-choose');

        $.each(cards, function (index, value) {

            if ($(this).hasClass('phase-selected')) {
                $(this).removeClass('phase-selected');
            }
        });
    }

    //UI Highlight für Dealer Auswahl
    function checkDealerSelection() {
        var cards = $('.dealer-choose');

        $.each(cards, function (index, value) {

            if ($(this).hasClass('phase-selected')) {
                $(this).removeClass('phase-selected');
            }
        });
    }

    //Erezugt das Spielfeld
    function createGameTable() {
        var playerinfodata = "";
        var dealerString = "";

        if (getNumberOfPlayers() > 1)
        {
            

            for (var i = 0; i < getNumberOfPlayers(); i++) {

                var tryClass = "";

                if (players[i]['rounds'].length > 0)
                {
                    tryClass = "clickable-text";
                }

                playerinfodata += `
                <tr class="table-row" data-player-id="`+ i + `" id="playerinfo_header_` + i + `">
                    <td class="table-cell" id="player-name-` + i + `">` + players[i]["name"] + `</td>
                    <td class="table-cell player-phase center-align" id="player-phase-` + i + `"><span class="clickable-text">` + players[i]["phase"] + `</span></td>
                    <td class="table-cell center-align player-trys" id="player-last-points-` + i + `"><span class="`+tryClass+`">` + players[i]["last_points"] + `</span></td>
                    <td class="table-cell center-align" id="player-points-` + i + `">` + players[i]["points"] + `</td>
                </tr>"`;
            }

            $('#player-info-data').html(playerinfodata);

            for (i = 0; i < getNumberOfPlayers(); i++) {
                if (players[i]["dealer"] === true) {
                    $('#playerinfo_header_' + i).addClass('dealer-highlight');
                }
                else {
                    $('#playerinfo_header_' + i).removeClass('dealer-highlight');
                }
            }

            $('.player-phase').click(function () {
                var card_id = gameInfo["phaseCardId"];
                var phase_id = $(this).children().html();
                createPhaseCard(card_id, phase_id);
            });

            $('.player-trys').click(function () {
                var playerID = $(this).parent().attr("data-player-id");
                router.navigate('playertrys/'+playerID);
            });


            //Edit Button anzeigen, sobald die erste Runde gespielt ist.
            if (players[0]["rounds"].length > 0) {
                $('#edit-last').css('visibility', 'visible');
            }
        }
    }

    router.on('playertrys/:id', function (params) {
        generateUserRounds(params.id);
    }).resolve();

    //Zeigt die Zusammesfassung aller gespielten Runden eines Spielers an
    function generateUserRounds(user) {
        var rounds = players[user]["rounds"];
        var numRounds = rounds.length;
        var phase = 0;
        var trys = 0;
        var points = 0;

        console.info(numRounds + " rounds are available at user " + user);

        $("#ur-round-wrapper").html("");
        $("#ur-username").html(players[user]["name"]);

        createUrHeader(phase);
        console.info("Phase " + phase + " header generated");

        if (numRounds > 0) {
            for (round = 0; round < numRounds; round++) {

                trys++;
                points = points + parseInt(players[user]["rounds"][round]["points"]);

                $("#ur-hdr-phase-" + phase).html("Phase " + (parseInt(phase) + 1));
                $("#ur-hdr-try-" + phase).html(trys);
                $("#ur-hdr-points-" + phase).html(points);


                createUrRow(players[user]["rounds"][round]["points"], players[user]["rounds"][round]["completed"], trys);
                console.info("Round " + round + " row generated");


                if (players[user]["rounds"][round]["completed"] === true && (round + 1 < numRounds)) {
                    phase++;
                    createUrHeader(phase);
                    console.info("Phase " + phase + " header generated");
                    trys = 0;
                    points = 0;
                }
            }

            if (!devMode) {
                $('#game-field-wrapper').hide(500);
                $('#user-rounds-wrapper').show(500);
            }
        }
    }

    //Erzeugt den Header der Userrounds für jede Phase
    function createUrHeader(phase) {
        $("#ur-round-wrapper").append(`
        <tr class="table-row border-bottom ur-tbl-header" id="ur-table-header-`+ phase + `">
            <td class="left-align">
                <div class="left"><i class="material-icons main-color-light">done_all</i></div>
                <div class="ur-tr-header left" id="ur-hdr-phase-`+ phase + `">Phase 1</div>
                <div class="clearfix"></div>
            </td>
            <td class="center-align">
                <div class="ur-tr-header right" id="ur-hdr-try-`+ phase + `">0</div>
                <div class="right"><i class="material-icons main-color-light">cached</i></div>
                <div class="clearfix"></div>
            </td>
            <td class="center-align">
                <div class="ur-tr-header right" id="ur-hdr-points-`+ phase + `">0</div>
                <div class="right"><i class="material-icons main-color-light">functions</i></div>
                <div class="clearfix"></div>
            </td>
        </tr>`);
    }

    //Erzeugt eine neue Zeile für die Userrounds pro gespieltem Spiel
    function createUrRow(points, done, trys) {
        var image = (done) ? "gfx/right.png" : "gfx/cross.png";

        $("#ur-round-wrapper").append(`
        <tr class="ur-removeable-round">
            <td class="left-align try-cell">Versuch `+ trys + `</td>
            <td class="right-align ur-td-cell"><img src="`+ image + `"/></td>
            <td class="right-align ur-td-cell">`+ points + `</td>
        </tr>`);
    }

    //Runde abschließen
    $('#finish-round').click(function () {
        router.navigate('finishround');
    });

    router.on('finishround', function () {
        console.info("Runde abschließen Dialog gestartet");
        create_finish_round_dialog();

        if (devMode === false) {
            $('#finish-form').show(500);
            $('#game-field-wrapper').hide(500);
            $('#edit-round-wrapper').hide(500);
        }
    }).resolve();

       //Runden bearbeiten
    $('#edit-last').click(function () {
        router.navigate('editround');
    });

    router.on('editround', function ()
    {
        console.info("Runde bearbeiten Dialog gestartet");

        $('#round-number').html("");

        num_rounds = players[0]["rounds"].length;

        for (i = num_rounds - 1; i >= 0; i--) {
            var rnd_display = i + 1;
            var rnd = (i === num_rounds - 1) ? "Letzte" : rnd_display + ".";
            $('#round-number').append("<option value=\"" + i + "\">" + rnd + " Runde</option>");
        }

        create_finish_round_dialog(true);

        $('#round-number').change(function () {
            create_finish_round_dialog(true);
        });

        if (devMode === false) {
            $('#edit-round-wrapper').show(500);
            $('#finish-form').hide(500);
            $('#game-field-wrapper').hide(500);
        }
    }).resolve();

    //Erezugt den Runde abschließen oder Runde bearbeiten Dialog (über Parameter gesteuert)
    function create_finish_round_dialog(edit_round = false) {
        num_players = getNumberOfPlayers();
        $('#finish-input-wrapper').html("");
        $('#edit-input-wrapper').html("");

        for (i = 0; i < num_players; i++) {

            var round = -1;
            var points = "";
            var phase = "";
            var input_wrapper = "";
            var autofocus = (i === 0) ? "autofocus": null;

            if (edit_round === true) {
                round = $('#round-number').val();
                points = players[i]["rounds"][round]["points"];
                phase = (players[i]["rounds"][round]["completed"] === true) ? 'checked="checked"' : "";
                input_wrapper = "#edit-input-wrapper";

            }
            else {
                round = -1;
                points = "";
                phase = 'checked="checked"';
                input_wrapper = "#finish-input-wrapper";
            }

            var player_name = players[i]["name"];

            $(input_wrapper).append(`
                <tr class="table-row">
                    <td>`+ player_name + `</td>
                    <td class="left-align"><input id="player-points-input-`+ i + `" tabindex="` + (i + 1) + `" type="number" class="finish-points-input" data-checkbox-id="` + i + `" value="` + points + `"  ` + autofocus +`></td>
                    <td class="center-align">                
                        <div class="checkbox">
                            <input type="checkbox" id="player-phase-finish-`+ i + `" ` + phase +`>
                            <label for="player-phase-finish-`+ i + `"></label>
                        </div>
                    </td>
                </tr>`
            );
        }

        $(input_wrapper).prepend(`
            <tr class="table-row">
                <td width="40%"><i class="material-icons main-color-light">person</i></td>
                <td width="30%" class="center-align"><i class="material-icons main-color-light">dialpad</i></td>
                <td class="center-align"><i class="material-icons main-color-light">done_all</i></td>
            </tr>`
        );

        $(input_wrapper).append(`<input type="hidden" id="rnd-nmbr" value="` + round + `">`);

        $('.finish-points-input').on('keyup', function () {
            var plid = $(this).attr("data-checkbox-id");
            console.info("Player ID ist " + plid + ":");

            if ($(this).val() < 50) {
                $('#player-phase-finish-' + plid).prop('checked', true);
                console.info("phase_finished set 2 true cause val = " + $(this).val());
                console.info("Attr = " + $('#player-phase-finish-' + plid).prop('checked'));
            }
            else {
                $('#player-phase-finish-' + plid).prop('checked', false);
                console.info("phase_finished set 2 false cause val = " + $(this).val());
                console.info("DOM Ceckbox = " + $('#player-phase-finish-' + plid).prop('checked'));
            }
        });
    }

    //Speichert eine abgeschlossene Runde (UI)
    $('#save-round').click(function () {
        save_round(-1);

    });
    //Aktualisiert eine abgeschlossene Runde (UI)
    $('#edit-round-btn').click(function () {
        var round = $('#rnd-nmbr').val();
        save_round(round);
    });

    //Schließt die Userround Übersicht
    $("#close-ur-btn").click(function () {
        history.back();

    });

    //Speichert eine abgeschlossene Runde und aktualisiert die Daten aller Spieler
    function save_round(round) {

        var rnd_num = 0;

        if (round === -1) {
            rnd_num = players[0]["rounds"].length;
        }
        else {
            rnd_num = round;
        }


        num_players = getNumberOfPlayers();
        console.log("Current players: " + num_players);

        var newDealer = 0;

        for (i = 0; i < num_players; i++) {
            players[i]["rounds"][rnd_num] = new Object();

            player_points = $('#player-points-input-' + i + '').val();


            if ($('#player-phase-finish-' + i + '').is(":checked")) {
                phase_completed = true;
            }

            else {
                phase_completed = false;
            }

            if (player_points === "") {
                player_points = "0";
                phase_completed = true;
            }


            if (round === -1) {
                if (players[i]["dealer"] === true) {
                    if ((i + 1) >= num_players) {
                        newDealer = 0;
                    }
                    else {
                        console.info("Player " + i + " is current Dealer.");
                        newDealer = i + 1;
                    }
                    players[i]["dealer"] = false;
                }
            }

            console.info("Phase complete " + phase_completed + " on User " + players[i]["name"]);

            players[i]["rounds"][rnd_num]["points"] = player_points;
            players[i]["rounds"][rnd_num]["completed"] = phase_completed;

            console.info("Data saved: " + players[i]["rounds"][rnd_num]["points"] + " Points on " + players[i]["name"] + " (Round " + rnd_num + ")");
        }

        if (round === -1) {
            players[newDealer]["dealer"] = true;
            console.info("Player " + newDealer + " is the new Dealer.");
        }



        updatePlayerInfo();
        history.back();


    }

    //Berechnet die Punkte und Phasen aller Spieler neu und aktualisiert das UI
    function updatePlayerInfo() {

        num_players = getNumberOfPlayers();


        for (i = 0; i < num_players; i++) {
            num_rounds = players[i]["rounds"].length;
            reset_player_info(i);
            var phaseTrys = 1;

            if (players[i]["dealer"] === true) {
                $('#playerinfo_header_' + i).addClass('dealer-highlight');
            }
            else {
                $('#playerinfo_header_' + i).removeClass('dealer-highlight');
            }

            for (j = 0; j < num_rounds; j++) {
                players[i]["points"] = parseInt(players[i]["points"]) + parseInt(players[i]["rounds"][j]["points"]);

                if (players[i]["rounds"][j]["completed"] === true) {
                    players[i]["phase"] = parseInt(players[i]["phase"]) + 1;
                    phaseTrys = 1;
                }
                else {
                    phaseTrys += 1;
                }


                if (j + 1 === num_rounds) {
                    players[i]["last_points"] = phaseTrys;
                }


            }

            console.info(players[i]["name"] + " has " + players[i]["points"] + " Points right now");
            console.info(players[i]["name"] + " in Phase " + players[i]["phase"] + " right now");
            $('#player-phase-' + i).html(players[i]["phase"]);
            $('#player-points-' + i).html(players[i]["points"]);
            $('#player-last-points-' + i).html(players[i]["last_points"]);

            if (players[i]["phase"] - 1 >= phases[0]["phase"].length) {
                showMessage("Das Spiel ist abgeschlossen. Herzlichen Glückwunsch!");
            }

        }

        $('#round-counter').html(players[0]["rounds"].length + 1);

        save();

        //Edit Button anzeigen, sobald die erste Runde gespielt ist.
        if (players[0]["rounds"].length > 0) {
            $('#edit-last').css('visibility', 'visible');
        }


        console.info(players[0]["rounds"].length + " Rounds has been played");

        console.info("-------------------------");
    }

    //Autosave Funktion, damit das Spiel nach dem Beenden der App fortgesetzt werden kann.
    function save() {

        if (savegame)
        {
            localStorage.setItem('savegame', JSON.stringify(players));
            localStorage.setItem('gameInfo', JSON.stringify(gameInfo));
            console.log("Savegame was stored in local storage.");
            console.log(localStorage.getItem('savegame'));
            console.log(localStorage.getItem('gameInfo'));
        }
    }

    //Setzt alle Werte des Spieler auf Standardeinstellungen zurück
    function reset_player_info(player_id) {
        players[player_id]["points"] = 0;
        players[player_id]["last_points"] = 0;
        players[player_id]["phase"] = 1;
    }

    //Überprüft ob auf den LocalStorage des Browsers zugegriffen werden kann.
    function checkLocalStorage() {
        try
        {
            localStorage.setItem('test', 'test');
            localStorage.getItem('test');
            localStorage.removeItem('test');
            savegame = true;
            return true;
        }
        catch (e) {
            console.warn("localStorage not available");
            console.warn("savegames are not active");
            savegame = false;
            showMessage(`
                Warnung!<br><br>Wir haben keinen Zugriff auf deinen internen Speicher.<br><br>
                Autosave wurde deaktiviert.<br><br>Du kannst das Spiel normal spielen, allerdings ist es NICHT möglich das Spiel zu speichern.<br><br>
                Wenn du die App beendest, kann das Spiel nicht fortgesetzt werden!`);
            return false;
        }
    }

    //Überprüft ob ein gespeichertes Spiel vorhanden ist, welches fortgesetzt werden könnte
    function checkSaveGame()
    {
        if (savegame)
        {
            if (!localStorage.getItem('savegame'))
            {
                return false;
            }
            else
            {
                return true;
            }
        }
        else
        {
            return false;
        }
    }

    //Anzahl der vorhandenen Spieler feststellen
    function getNumberOfPlayers()
    {
        if (typeof players.length !== "undefined" && players.length > 0)
        {
            console.log("numPlayers: "+players.length+" got from players Array");
            return players.length;
        }
        else
        {
            if ($('#num-players').val() === "") {
                return 0;
            }
            else {
                console.log("numPlayers: " + parseInt($('#num-players').val()) + " got from num_player_inut Field");
                return parseInt($('#num-players').val());
            }
        }

    }

    //Savegame laden
    function loadGame() {
        if (hasSavegame) {
            players = JSON.parse(localStorage.getItem('savegame'));
            gameInfo = JSON.parse(localStorage.getItem('gameInfo'));

            createGameTable();

            $('#round-counter').html(players[0]["rounds"].length + 1);
            $('#game-control-wrapper').css('visibility', 'visible');

            gameStarted = true;
        }
        else
        {
            console.log("Routed from loadGame() to Homepage");
            router.navigate('');

        }
    }
});