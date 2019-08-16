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

<b>Vote Status:</b>

<pre>
    struct voted {
      bool like;
      bool dislike;
    }
</pre>


  

