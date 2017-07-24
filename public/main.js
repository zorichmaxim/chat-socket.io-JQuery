let socket = io();
$(() => {
    let userStory = {};
    let emitFunc = () => {
        console.log(userStory.name);
        let messages = $('#m').val();
        if (messages == '') {
            return false
        }
        else {
            let dataUser = [messages, userStory.name];
            socket.emit('chat msg from client', dataUser);
            $('#m').val('');
        }
    };

    let createMessageTemplate = (msg) => {
        let [message, name] = msg;
        $('.chat').append("<li class='self db-messages'><div class='avatar'><img src='https://i.imgur.com/HYcn9xO.png' draggable='false'/></div><div class='msg'><p class='msg-name msg-name-right'>" + `${name}` + "</p><p>" + `${message}` + "</p><time>18:03</time></div></li>");
        window.scrollTo(0, document.body.scrollHeight);
    };

    class User {
        constructor(name, password) {
            this.name = name;
            this.password = password;
        }
    }

    $('.form-submit-btn').on('click', () => {
        let userName = $('#userName').val(),
            userPassword = $('.userPassword').val(),
            user = new User(userName, userPassword);
            userStory.name = userName;
            socket.emit('authentication', user);
            socket.on('name is busy', () => {
                console.log('name is field');
            });
    });

    $('#submit-btn').on('click', () => {
        emitFunc();
    });

    $(document).keyup(() => {
        if (event.keyCode == 13) {
            emitFunc()
        }
    });

    socket.on('load items', (items) => {
        $('.overlay').addClass('modal--show');
        $('.modal--transition').addClass('modal--show');


        $('.db-messages').remove();
        let fragment = document.createElement('div'),
            l = items.length;
        for (let i = 0; i < l; i++) {
            let msgUser = items[i].msg;
            let nameUser = items[i].name;
            fragment.innerHTML += "<li class='self db-messages'><div class='avatar'><img src='https://i.imgur.com/HYcn9xO.png' draggable='false'/></div><div class='msg'><p class='msg-name msg-name-right'>" + `${nameUser}` + "</p><p>" + `${msgUser}` + "</p><time>18:03</time></div></li>";
        }
        $('.chat').append(fragment);
    });

    socket.on('chat message from io', (msg) => {
        createMessageTemplate(msg);
    });

});