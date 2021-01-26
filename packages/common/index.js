"use strict";
exports.__esModule = true;
exports.Card = exports.MessageBase = exports.Message = exports.GameAction = void 0;
var actions_1 = require("./src/actions");
exports.GameAction = actions_1.GameAction;
var network_message_1 = require("./src/network-message");
exports.Message = network_message_1.Message;
var message_1 = require("./src/message");
exports.MessageBase = message_1.MessageBase;
var Card;
(function (Card) {
    var Suit;
    (function (Suit) {
        Suit[Suit["Diamond"] = 0] = "Diamond";
        Suit[Suit["Club"] = 1] = "Club";
        Suit[Suit["Heart"] = 2] = "Heart";
        Suit[Suit["Spade"] = 3] = "Spade";
    })(Suit = Card.Suit || (Card.Suit = {}));
    var Value;
    (function (Value) {
        Value[Value["Three"] = 0] = "Three";
        Value[Value["Four"] = 1] = "Four";
        Value[Value["Five"] = 2] = "Five";
        Value[Value["Six"] = 3] = "Six";
        Value[Value["Seven"] = 4] = "Seven";
        Value[Value["Eight"] = 5] = "Eight";
        Value[Value["Nine"] = 6] = "Nine";
        Value[Value["Ten"] = 7] = "Ten";
        Value[Value["Jack"] = 8] = "Jack";
        Value[Value["Queen"] = 9] = "Queen";
        Value[Value["King"] = 10] = "King";
        Value[Value["Ace"] = 11] = "Ace";
        Value[Value["Two"] = 12] = "Two";
    })(Value = Card.Value || (Card.Value = {}));
})(Card || (Card = {}));
exports.Card = Card;
