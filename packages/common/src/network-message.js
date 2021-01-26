"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.Message = void 0;
var message_1 = require("./message");
var Message;
(function (Message) {
    var Type;
    (function (Type) {
        // These three are special use for socket.io
        Type["Connect"] = "connect";
        Type["Disconnect"] = "disconnect";
        Type["ConnectError"] = "connect_error";
        // These are not
        Type["ServerChat"] = "CHAT";
        Type["ClientChat"] = "CLIENT_CHAT";
        Type["SessionsData"] = "SESSIONS_DATA";
        Type["Join"] = "JOIN";
        Type["JoinAck"] = "JOIN_ACK";
        Type["PlayCards"] = "PLAY_CARD";
    })(Type = Message.Type || (Message.Type = {}));
    ;
    var Join = /** @class */ (function (_super) {
        __extends(Join, _super);
        function Join(payload) {
            var _this = _super.call(this) || this;
            _this.header = Type.Join;
            _this.payload = payload;
            return _this;
        }
        return Join;
    }(message_1.MessageBase));
    Message.Join = Join;
    var Chat = /** @class */ (function (_super) {
        __extends(Chat, _super);
        function Chat(payload) {
            var _this = _super.call(this) || this;
            _this.header = Type.ServerChat;
            _this.payload = payload;
            return _this;
        }
        return Chat;
    }(message_1.MessageBase));
    Message.Chat = Chat;
    var FromClientChat = /** @class */ (function (_super) {
        __extends(FromClientChat, _super);
        function FromClientChat(payload) {
            var _this = _super.call(this) || this;
            _this.header = Type.ClientChat;
            _this.payload = payload;
            return _this;
        }
        return FromClientChat;
    }(message_1.MessageBase));
    Message.FromClientChat = FromClientChat;
    var SessionsData = /** @class */ (function (_super) {
        __extends(SessionsData, _super);
        function SessionsData(payload) {
            var _this = _super.call(this) || this;
            _this.header = Type.SessionsData;
            _this.payload = payload;
            return _this;
        }
        return SessionsData;
    }(message_1.MessageBase));
    Message.SessionsData = SessionsData;
})(Message = exports.Message || (exports.Message = {}));
