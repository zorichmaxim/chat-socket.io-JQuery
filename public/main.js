let socket = io();
$(() => {
    let emitFunc = () => {
        let messages = $('#m').val();
        if (messages == '') {
            return false
        }
        else {
            socket.emit('chat msg', $('#m').val());
            $('#m').val('');
        }
    };
    let createMessageTemplate = (msg) => {
        $('.chat').append("<li class='self db-messages'><div class='avatar'><img src='https://i.imgur.com/HYcn9xO.png' draggable='false'/></div><div class='msg'><p>" + `${msg}` + "</p><time>18:03</time></div></li>");
        window.scrollTo(0, document.body.scrollHeight);
    };

    $('#submit-btn').on('click', () => {
        emitFunc();
    });
    $(document).keyup(() => {
        if (event.keyCode == 13) {
            emitFunc()
        }
    });
    socket.on('load items', (items) => {
        $('.db-messages').remove();
        let fragment = document.createElement('div'),
            l = items.length;
        for (let i = 0; i < l; i++) {
            let msg = items[i].msg;
            fragment.innerHTML += "<li class='self db-messages'><div class='avatar'><img src='https://i.imgur.com/HYcn9xO.png' draggable='false'/></div><div class='msg'><p>" + `${msg}` + "</p><time>18:03</time></div></li>";
        }
        $('.chat').append(fragment);
    });

    socket.on('chat message', (msg) => {
        createMessageTemplate(msg);
    })
});