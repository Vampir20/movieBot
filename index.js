const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot('6171952434:AAGEpyg-y3j45NEwDUR92eh9uVddVP_DHyI', { polling: true})
module.exports = bot;
const fs = require('fs');
const movies = require('./movies.json');


function getMovies(msg){
    const text = msg.text;

    movies.push(text);
    fs.writeFileSync('movies.json', JSON.stringify(movies, null, '\t'));
    bot.removeListener('message', getMovies);
}

var options = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: "sendMessage", callback_data:"sendMessage", getMovies}],
            [{text: "показать фильм", callback_data:"/showmovie"}],
            [{text: "about", callback_data:"about"}],
            [{text: "support", url: "t.me/BXyhbq",  callback_data:"support"}],

        ]   
    })
}

var adminOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: "добавить фильм", callback_data: " добавить фильм"}],
            [{text: "просмотреть текущие фильмы", callback_data: "просмотреть текущие фильмы"}],
        ]
    
})
}



bot.on ("message", msg => {
    const chatId = msg.chat.id;
    const text =  msg.text;
    if (chatId != "5770886713"){
        if (text == "/start"){
            bot.sendMessage(chatId, "Привет! Вы можете начать работу", options)
        }
}
})

bot.on("message", msg => {
    const chatId = msg.chat.id;
    // const text =  msg.text; если надо будет отлавливать сообщения пользователя тогда расскаментируй эту строчку и добавь куда надо
    var movs = movies.filter(x => x.id === msg.from.id)[0]

    //мой chatId 5770886713
    if (chatId == "поставь свой чат айди когда будешь решать задачу тебе надо быть админом для этого нужен твой чат айди"){
        bot.sendMessage(chatId, "привет админ вот что ты можешь сделать", adminOptions)
        bot.on("message", getMovies);
        bot.removeAllListeners("message")
        if (!movs){
            movies.push({
                name: msg.from.username,
                id: msg.from.username
            })
            var movs = movies.filter(x => x.id === msg.from.id)[0]
            bot.sendMessage(chatId, "Привет! фильм был добавлен")
        }else{
            bot.sendMessage(chatId, "такой фильм уже существует")
        }
        

    }
})

bot.on("callback_query", query => {
    bot.sendMessage(query.message.chat.id, "привет админ вот твоя кнопка", query.data)
})


bot.on("polling_error", console.log)