var socket = require('socket.io-client'),
    cred = {
        name : 'Tony Tripper',
        email: 'tonysanv@gmail.com',
        url : 'https://github.com/tonysan/yahoobingo'
    },
    card,
    client = socket.connect('ws://yahoobingo.herokuapp.com');

client.on('connect', function() {
    client.emit('register', cred);
});

client.on('card', function(resp) {
    console.log('Got a bingo card:');
    console.log(resp);
    card = resp;
});

client.on('number', function(number){
    punchCard(number);
});



// remove element on original card
function punchCard(number)
{
    var numberObj = {};

    // first char is row number
    numberObj.row = number.slice(0,1);

    // rest is col, force cast to integer
    numberObj.val = Number(number.slice(1));

    //console.log(numberObj);
    //console.log('Row of ' + numberObj.row + ' is:');
    //console.log(card.slots[numberObj.row]);
    var pos = card.slots[numberObj.row].lastIndexOf(numberObj.val);
    var cardRow = card.slots[numberObj.row];

    if (pos != -1)
    {
        cardRow[pos] = '';
        console.log('');
        console.log('Number '+ numberObj.val + ' found on row ' + numberObj.row);
        console.log(card);
        checkCard(card);
    }
    process.stdout.write('.');
}

function checkCard(card)
{
    var row = ['B', 'I', 'N', 'G', 'O'];
        bingoCount = 0;

    for(var i=0; i<5; i++)
    {
        var cardRow = card.slots[row[i]];
        // all row are empty strin
        if (cardRow[0] == '' && cardRow[1] == '' && cardRow[2] == '' && cardRow[3] == '' && cardRow[4] == '')
        {
            bingoCount++;
            console.log('Bingo #'+bingoCount+' found on row '+row[i]);
        }

        // column
        if (card.slots.B[i] == '' &&  card.slots.I[i] == '' && card.slots.N[i] == '' && card.slots.G[i] == '' && card.slots.O[i] == '')
        {
            bingoCount++;
            console.log('Bingo #'+bingoCount+' found on column '+i);
        }
    }


    // crosses (0,0 - 4,4 & 4,0 3,1 2,2 1,3 0,4)
    if (card.slots.B[0] == '' && card.slots.I[1] == '' && card.slots.N[2] == '' && card.slots.G[3] == '' && card.slots.O[4] == '')
    {
        bingoCount++;
        console.log('Bingo #'+bingoCount+' found on NW-SE');
    }

    if (card.slots.B[4] == '' && card.slots.I[3] == '' && card.slots.N[2] == '' && card.slots.G[1] == '' && card.slots.O[0] == '')
    {
        bingoCount++;
        console.log('Bingo #'+bingoCount+' found on NE-SW');
    }


    // card full of holes
    if (bingoCount > 0)
    {
        client.emit('bingo');
        console.log('Called bingo!');
        return 0;
        //console.log('This card is done, asking for a new card.');
        //socket.disconnect();
        //client = socket.connect('ws://yahoobingo.herokuapp.com');
        //client.emit('register', cred);
    }
}
