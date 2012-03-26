require 'spec_helper'

describe TweetsController do
  before(:each) do
    @tweets = []
     VCR.use_cassette('twitter') do
       @tweets1 = Twitter.user_timeline("rbates")
       @tweets2 = Twitter.user_timeline("engineyard")
       @tweets3 = Twitter.user_timeline("railsconf")
       @new_tweets = Twitter.user_timeline("rbates", :since_id => 183363373839290368)
      end
      @tweets= @tweets1 + @tweets2 + @tweets3
      @tweets.sort!{|a,b| b.id <=> a.id }
  end
  
  it "should get the users status" do  
    VCR.use_cassette('twitter') do
      xhr :get, :index, :tweets => {"user1" => "rbates", "user2" => "engineyard", "user3" => "railsconf" }
    end 
    assigns(:tweets).should_not be_empty
    assigns(:tweets).should == @tweets
  end  
  
  it "should load the new statuses of a user" do
    VCR.use_cassette('twitter') do
      xhr :get, :index, :tweets => {"user1" => "rbates", "user2" => "", "user3" => "", "last_id1" => "183363373839290368" }
    end
    assigns(:tweets).should_not be_empty
    assigns(:tweets).should == @new_tweets
  end
  
  it "should change the error flag to true if any of the usernames doesnt exist" do
      VCR.use_cassette('twitter') do
        xhr :get, :index, :tweets => {"user1" => "rbates123123123123123123123123123123123", "user2" => "rbates", "user3" => ""}
      end
      assigns(:tweets).should_not be_empty
      json = JSON.parse(response.body)
      assigns(:tweets).should == @tweets1
      json["error"].should == true
  end
  
  it "should not return any value on the json variables if any of the users is valid" do
      VCR.use_cassette('twitter') do
        xhr :get, :index, :tweets => {"user1" => "rbates123123123123123123123123123123123", "user2" => "", "user3" => ""}
      end
      assigns(:tweets).should be_empty
      json = JSON.parse(response.body)
      json["tweets_list"].should be_empty
      json["last_ids"].should == [nil,nil,nil]
      json["valid_user"].should be_blank
      json["error"].should == true
  end
      
end