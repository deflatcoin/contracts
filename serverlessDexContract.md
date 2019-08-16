# Abstract

The purpose of the contract is to provide a routine for asset swapping, without the need for a of-chain database.

For this part of the contract emulates the behavior of a relational database within a blockchain.

The structures needed to be very basic and summarized so as not to exceed the Ethernet bytecode size limit at this time.

# Primary Mapps:
  
  <pre>
    mapping(uint => address) public index;
    mapping(address => token) public tokens;
    mapping(address => bool) public exists;	
  </pre>
  
  1- Index: Convert token position to base token address;
  
  2- tokens: Mapping to Token Data struct;
  
  3- exists: formality only, true if the token is listed.


# Tables

<b>Token Data:</b>

<pre>
    struct token {
      address tokenBase;
      string name;
      string symbol;
      uint decimals;
      uint likesCount;
      uint dislikesCount; 
      uint marketsCount;
      mapping(uint => address) marketIndex; 
      mapping(address => market) markets;
      mapping(address => voted) voteStatus;
    }
</pre>

1- address: Token address;

2- name: Friendly token name, recovered from contract;

3- symbol: Short token name, recovered from contract;

4- decimals: Decimal places of token, recovered from contract;

5- likes count & dislikes count: token reputation for gateway filter (optional);

6- markets count: Incemented to each market created;

7- marketIndex: Index position to address of market struct;

8- markets: market struct mapped by address;

9- voteStatus: indicates if an account has already voted for the token;

<b>Markets:</b>

<pre>
    struct market {  
      bool exists;
      address tokenPair;
      uint ordersCount;
      uint donesCount;
      mapping(uint => order) orders; 
      mapping(uint => done) dones;
    }
</pre>	

1- exists: Formal, true if market exists;

2- address: Pair address;

3- ordersCount: increased after market add;

5- donesCount: incriase after fill order;

6- orders: mapping to market struct;

7- dones: mapping to executed orders struct;

<b>Orders:</b>

<pre>
    struct order {
      uint orderId;
      address orderOwner;
      uint rate;
      uint amount;
      bool sell; 
      uint date;
    } 
</pre>

1- orderId: Order identifier;

2- orderOwner: address of maker account;

3- rate: Value relationship between base and pair;

4- amount: order amount;

5- sell: type of order, sell or buy (1,0);

6- date: order date. 

<b>Orders Done: </b>

<pre>
    struct done {
      uint orderId;
      address fillOwner;
      uint fillAmount;
      uint fillDate;
      uint rate;   
    }
</pre>

1- orderId: Order idenfier;

2- filOwner: order fill address;

3- fillAmount: parcial or total fill amount;

4- fillDate: fill action date;

5- rate: rate of executed order.

<b>Vote Status:</b>

<pre>
    struct voted {
      bool like;
      bool dislike;
    }
</pre>

1- like & dislike: Last vote status from an account to a token.

# Functions

<b>getTokenByAddr</b>

<pre>
    function getTokenByAddr(address _addr) public view returns (string _name, 
                                                                string _symbol, 
                                                                uint _decimals, 
                                                                uint _marketsCount) {

       return (tokens[_addr].name,
               tokens[_addr].symbol,
               tokens[_addr].decimals,
               tokens[_addr].marketsCount);
    }
</pre>

1- Get token data by address.

<b>getTokenByIndex</b>

<pre>
    function getTokenByIndex(uint _index) public view returns (address _tokenBase, 
                                                               string _name, 
                                                               string _symbol, 
                                                               uint _decimals, 
                                                               uint _marketsCount) {
       return (tokens[index[_index]].tokenBase, 
               tokens[index[_index]].name,
               tokens[index[_index]].symbol,
               tokens[index[_index]].decimals,
               tokens[index[_index]].marketsCount);
    }
</pre>

1- Get token data by index, use with indexCount var to get token list.

<b>getPairByAddr</b>

<pre>
    function getPairByAddr(address _base, address _pairAddr) public view returns (uint _ordersCount, uint _donesCount, bool _exists) {        
       return (tokens[_base].markets[_pairAddr].ordersCount,
               tokens[_base].markets[_pairAddr].donesCount,
               tokens[_base].markets[_pairAddr].exists);
    }
</pre>

1- _base: token base;

2- _pairAddr: pair address;

3- return: return count of orders and excuted orders for the given pair.

<b>getPairByIndex</b>

<pre>
    function getPairByIndex(address _base, uint _pairIndex) public view returns (address _tokenPair, uint _ordersCount, uint _donesCount) {
       return (tokens[_base].markets[tokens[_base].marketIndex[_pairIndex]].tokenPair,
               tokens[_base].markets[tokens[_base].marketIndex[_pairIndex]].ordersCount,
               tokens[_base].markets[tokens[_base].marketIndex[_pairIndex]].donesCount);
    }
</pre>
	
1- _base: token base;

2- _pairAddr: pair address

3- return: return count of orders and excuted orders for the given pair;

4- use with marketsCount in token data to get list of markets for a given pair.

<b>getOrders</b>

<pre>
    function getOrders(address _base, address _pair, uint _orderIndex) public view returns (uint _orderId,
                                                                                            address _owner,
                                                                                            uint _rate,
                                                                                            uint _amount,
                                                                                            bool _sell) {
       return (tokens[_base].markets[_pair].orders[_orderIndex].orderId,
               tokens[_base].markets[_pair].orders[_orderIndex].orderOwner,
               tokens[_base].markets[_pair].orders[_orderIndex].rate,
               tokens[_base].markets[_pair].orders[_orderIndex].amount,
               tokens[_base].markets[_pair].orders[_orderIndex].sell);
    }
</pre>

1- Get data from order record;

2- Use with ordersCount to get list of orders.

<b>getDones</b>

<pre>
    function getDones(address _base, address _pair, uint _doneIndex) public view returns (uint _orderId,
                                                                                          address _fillOwner,
                                                                                          uint _fillAmount,
                                                                                          uint _fillDate,
                                                                                          uint _rate) {
       return (tokens[_base].markets[_pair].dones[_doneIndex].orderId,
               tokens[_base].markets[_pair].dones[_doneIndex].fillOwner,
               tokens[_base].markets[_pair].dones[_doneIndex].fillAmount,
               tokens[_base].markets[_pair].dones[_doneIndex].fillDate,
               tokens[_base].markets[_pair].dones[_doneIndex].rate);
    }	
</pre>

1- Get data from executed order record;

2- Use with donesCout to get list of executed orders.

<b>registerToken</b>

<pre>
    function registerToken(address _token) public payable {
       require((msg.sender == owner) || (msg.value >= registerFee), "Register Fee Very Low");
       erc20 refToken = erc20(_token);
       if (!exists[_token]) {            
            indexCount = indexCount+1;
            index[indexCount] = _token; 
            tokens[_token].tokenBase = _token;  
            tokens[_token].name = refToken.name();		
            tokens[_token].symbol = refToken.symbol();
            tokens[_token].decimals = refToken.decimals();			
            tokens[_token].likesCount = 0;
            tokens[_token].dislikesCount = 0;
            tokens[_token].marketsCount = 0; 		
            exists[_token] = true;            
       }	             
    }
</pre>

0- Note: Divergent of the actual contract in ropsten test;

1- address: Token to register;

2- refToken: Get data from token contract;

3- indexCount: Increase token count;

4- index[]: Define tokenCount as token index;

5- name, symbol and decimal: from refToken contract;

6- liskesCount, dislikes and marketsCount: Start with 0;

7- exists: Formal, always true; 

<b>createMarket</b>

<pre>
    function createMarket(address _token, address _tokenPair) public payable {
      require(msg.value >= openMarketFee, "Open Market Fee Very Low");
      require(exists[_token] && exists[_tokenPair],"token or tokenPair not listed");     
      require(!tokens[_token].markets[_tokenPair].exists,"Market already exists");
      require(tokens[_token].tokenBase != _tokenPair,"Not allowed token = tokenPair");
      tokens[_token].marketsCount = tokens[_token].marketsCount+1;
      tokens[_token].marketIndex[tokens[_token].marketsCount] = _tokenPair;
      tokens[_token].markets[_tokenPair].tokenPair = _tokenPair;
      tokens[_token].markets[_tokenPair].ordersCount = 0;
      tokens[_token].markets[_tokenPair].donesCount = 0;
      tokens[_token].markets[_tokenPair].exists = true;
    }
</pre>

1- _token and _tokenPair: Pair market;

2- openMarketFee: Fee value for market creation;

3- marketsCount: Increase count of markets of base token;

4- marketIndex: Make marketsCount as index of current market;

5- ordersCount and donesCount: Set vars with 0;

6- exists: Formal always true after creation;

<b>withdraw</b>

<pre>
    function withdraw(uint amount) public {
	    require(ownwer == msg.sender,"Only for owner");
        require(amount+garbageFees <= address(this).balance,"No funds")		
        if (owner.send(amount)) {
           emit ctrWithdraw(owner, amount);     
        }  
    }
</pre>

0- Note: Not is in the actual contract, will be in next contract implementation;

1- Owner profit from token list, markets creation and action fees;

<pre>
    function createOrder(address _token, address _tokenPair, uint _rate, uint _amount, bool _sell) public payable {
       require(msg.value >= actionFee);  
       require(_token != _tokenPair,"Not allowed token = tokenPair");     
       require(exists[_token] && exists[_tokenPair],"Token or tokenPair not listed");
       require((_rate > 0) && (_rate <= (10**(ratePlaces*2)) && (_amount > 0) && (_amount <= 10**36)),"Invalid Values");
       tokens[_token].markets[_tokenPair].ordersCount = tokens[_token].markets[_tokenPair].ordersCount+1;
       tokens[_token].markets[_tokenPair].orders[tokens[_token].markets[_tokenPair].ordersCount].orderId = tokens[_token].markets[_tokenPair].ordersCount;
       tokens[_token].markets[_tokenPair].orders[tokens[_token].markets[_tokenPair].ordersCount].orderOwner = msg.sender; 
       tokens[_token].markets[_tokenPair].orders[tokens[_token].markets[_tokenPair].ordersCount].rate = _rate;
       tokens[_token].markets[_tokenPair].orders[tokens[_token].markets[_tokenPair].ordersCount].amount = _amount;
       tokens[_token].markets[_tokenPair].orders[tokens[_token].markets[_tokenPair].ordersCount].sell = _sell;
       tokens[_token].markets[_tokenPair].orders[tokens[_token].markets[_tokenPair].ordersCount].date = now;
	   emit orderPlaced(_token, _tokenPair, msg.sender, tokens[_token].markets[_tokenPair].ordersCount);
    }
</pre>
	
<pre>
    function tokenLike(address _token) public {	
       require(exists[_token], "Token not listed");    
       if (!tokens[_token].voteStatus[msg.sender].like) {
	      tokens[_token].likesCount = tokens[_token].likesCount+1;
          tokens[_token].voteStatus[msg.sender].like = true;
          if (tokens[_token].voteStatus[msg.sender].dislike) {
	          tokens[_token].dislikesCount = tokens[_token].dislikesCount-1;
              tokens[_token].voteStatus[msg.sender].dislike = false;
          }
       } else {
          tokens[_token].likesCount = tokens[_token].likesCount-1;
          tokens[_token].voteStatus[msg.sender].like = false;
       }	   
    }
</pre>

<pre>	
    function tokenDislike(address _token) public {
        require(exists[_token],"Token not listed");
   	if (!tokens[_token].voteStatus[msg.sender].dislike) {
	  tokens[_token].dislikesCount = tokens[_token].dislikesCount+1;
          tokens[_token].voteStatus[msg.sender].dislike = true;
          if (tokens[_token].voteStatus[msg.sender].like) {
            tokens[_token].likesCount = tokens[_token].likesCount-1;
            tokens[_token].voteStatus[msg.sender].like = false;
          }	   
        } else {
	      tokens[_token].dislikesCount = tokens[_token].dislikesCount-1;
          tokens[_token].voteStatus[msg.sender].dislike = false;
        }	   
    }
</pre>	
	
<pre>
    function cancelOrder(uint _orderId, address _token, address _tokenPair) public payable {
       require(tokens[_token].markets[_tokenPair].ordersCount > 0, "bof orders"); 
       uint orderAmount = tokens[_token].markets[_tokenPair].orders[_orderId].amount;
       erc20 tokenMaker = erc20(tokens[_token].tokenBase);
       if (tokens[_token].markets[_tokenPair].orders[_orderId].orderOwner != msg.sender) {
          require(
                   (tokenMaker.allowance(tokens[_token].markets[_tokenPair].orders[_orderId].orderOwner, address(this)) < orderAmount) ||
                   (tokenMaker.balanceOf(tokens[_token].markets[_tokenPair].orders[_orderId].orderOwner) < orderAmount), "Only garbage can be removed by you here"
          );	
       }             
       uint top = tokens[_token].markets[_tokenPair].ordersCount;
       tokens[_token].markets[_tokenPair].ordersCount = tokens[_token].markets[_tokenPair].ordersCount-1;      
       if (tokens[_token].markets[_tokenPair].orders[top].amount > 0) {
           tokens[_token].markets[_tokenPair].orders[_orderId] = tokens[_token].markets[_tokenPair].orders[top];       
           tokens[_token].markets[_tokenPair].orders[_orderId].orderId = _orderId;
           tokens[_token].markets[_tokenPair].orders[top].amount = 0;           
       }       
	   emit orderCanceled(_token, _tokenPair, _orderId);
       if (msg.sender.send(actionFee)) {
          emit ctrWithdraw(msg.sender, actionFee);     
       }  
    }
</pre>	

<pre>
    function fillOrder(uint _orderID, address _token, address _tokenPair, uint _rate, uint _amountFill) public payable {             
       require(tokens[_token].markets[_tokenPair].orders[_orderID].orderId > 0,"Not placed"); 
       require((_amountFill > 0) && (_amountFill <= 10**36),"Fill out of range");
       require(_rate == tokens[_token].markets[_tokenPair].orders[_orderID].rate,"Rate error");
       erc20 tokenMaker = erc20(tokens[_token].tokenBase);
       erc20 tokenTaker = erc20(tokens[_token].markets[_tokenPair].tokenPair);      	
       uint amount =  (((_amountFill*tokens[_token].markets[_tokenPair].orders[_orderID].rate)/(10**tokens[_tokenPair].decimals))*(10**tokens[_token].decimals))/(10**ratePlaces);
       require(tokenTaker.allowance(msg.sender, address(this)) >= _amountFill, "Verify taker approval");
       require(tokenTaker.balanceOf(msg.sender) >= _amountFill, "Verify taker balance");	
       require(tokenMaker.allowance(tokens[_token].markets[_tokenPair].orders[_orderID].orderOwner, address(this)) >= amount, "Verify maker approval");
       require(tokenMaker.balanceOf(tokens[_token].markets[_tokenPair].orders[_orderID].orderOwner) >= amount, "Verify maker balance");	
       require(tokens[_token].markets[_tokenPair].orders[_orderID].amount >= amount,"Amount error"); 
       tokens[_token].markets[_tokenPair].orders[_orderID].amount=tokens[_token].markets[_tokenPair].orders[_orderID].amount-amount;	         
       tokenMaker.transferFrom(tokens[_token].markets[_tokenPair].orders[_orderID].orderOwner, msg.sender,amount);
       tokenTaker.transferFrom(msg.sender,tokens[_token].markets[_tokenPair].orders[_orderID].orderOwner,_amountFill);
       tokens[_token].markets[_tokenPair].donesCount = tokens[_token].markets[_tokenPair].donesCount+1;
       tokens[_token].markets[_tokenPair].dones[tokens[_token].markets[_tokenPair].donesCount].orderId = _orderID;
       tokens[_token].markets[_tokenPair].dones[tokens[_token].markets[_tokenPair].donesCount].fillOwner = msg.sender;
       tokens[_token].markets[_tokenPair].dones[tokens[_token].markets[_tokenPair].donesCount].fillAmount = _amountFill;
       tokens[_token].markets[_tokenPair].dones[tokens[_token].markets[_tokenPair].donesCount].fillDate = now;
       tokens[_token].markets[_tokenPair].dones[tokens[_token].markets[_tokenPair].donesCount].rate = _rate;
       emit orderDone(_token, _tokenPair, _orderID, tokens[_token].markets[_tokenPair].donesCount);
       if (tokens[_token].markets[_tokenPair].orders[_orderID].amount*(10**(18-tokens[_token].decimals)) < minQtd) {
          require(tokens[_token].markets[_tokenPair].ordersCount > 0, "bof orders");
          uint top = tokens[_token].markets[_tokenPair].ordersCount;
          tokens[_token].markets[_tokenPair].ordersCount = tokens[_token].markets[_tokenPair].ordersCount-1;
          if (address(tokens[_token].markets[_tokenPair].orders[_orderID].orderOwner).send(actionFee)) {
             emit ctrWithdraw(address(tokens[_token].markets[_tokenPair].orders[_orderID].orderOwner), actionFee);     
          }          
          if (tokens[_token].markets[_tokenPair].orders[top].amount > 0) {
              tokens[_token].markets[_tokenPair].orders[_orderID] = tokens[_token].markets[_tokenPair].orders[top];          
              tokens[_token].markets[_tokenPair].orders[_orderID].orderId = _orderID;
              tokens[_token].markets[_tokenPair].orders[top].amount = 0;   
          }          
	      emit orderRemovedLowBalance(_token, _tokenPair, _orderID);
       }
    }  
}
</pre>
