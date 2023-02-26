const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot('6210140587:6174075115:AAF1jNr133frCvjHtOXxl5zrALmkt8E74rY', { polling: true })
const fs = require('fs');
const movies = require('./movies.json');
let newMove;

var options = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: "Показать фильм", callback_data:"showMovie"}],
            [{text: "support", callback_data:"support", url: "https://t.me/VitiaGurkoskii"}],
            [{text: "Перейти в канал", callback_data: null, url: "https://t.me/filmaniaTV"}]

        ]   
    })
}

var adminOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: "добавить фильм", callback_data: "addMovie"}],
            [{text: "просмотреть текущие фильмы", callback_data: "showCurrentMovie"}],
        ]
    
})
}

function getId(msg) {
    const text = msg.text;
    movies.push({
        movie_name: newMove,
        id: text

    })

    fs.writeFileSync('./movies.json', JSON.stringify(movies, null , '\t'))
    bot.sendMessage(msg.chat.id, "Фильм добавлен")
    bot.removeListener('message', getId)

}

function getMovies(msg) {
    const text = msg.text;
    newMove = text;
    bot.sendMessage(msg.chat.id, "Введите айди")
    bot.on('message', getId)
    bot.removeListener('message', getMovies)

}

function sendMovie(msg){
    const text = msg.text;
    let users = JSON.parse(fs.readFileSync('./movies.json', 'utf8'));
    for (let movie in users){
        let movieName = users[movie].movie_name;
        let movieId = users[movie].id;
        if (movieId == text){
            bot.sendMessage(msg.chat.id, movieName)
            break;
        }
    }
    bot.removeListener('message', sendMovie)
}

bot.on ("message", msg => {
    const admins = ["796478916", "5286688116"]
    const chatId = msg.chat.id;
    const text =  msg.text;
    console.log(msg);
    if (chatId == admins[0]){
        if (text == "/start"){
            bot.sendMessage(chatId, "Привет! Вы можете начать работу", adminOptions)
            console.log(msg);
        }
    }else if (chatId == admins[1]){
        if (text == "/start"){
            bot.sendMessage(chatId, "Привет! Вы можете начать работу", adminOptions)
            console.log(msg);
        }
    }else {
        bot.sendMessage(chatId, "Привет! Вы можете начать работу", options)
        console.log(msg);
    
    }
    
})

bot.on('callback_query', msg => {
    const chatId = msg.message.chat.id;
    const action = msg.data;
  
    if (action == 'addMovie') {
        bot.sendMessage(chatId, `Впишите название фильма который вы хотите добавить\nвпишите номер фильма по которому он будет показываться`)
        bot.on("message", getMovies)
        
        
    }else if (action == 'showMovie'){
        bot.sendMessage(chatId, "Введите номер")
        bot.on('message', sendMovie)
    }
  
  });

bot.on("polling_error", console.log)