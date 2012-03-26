class TweetsController < ApplicationController
  def index
    last_ids = [params[:tweets][:last_id1], params[:tweets][:last_id2], params[:tweets][:last_id3]]
    @tweets = []
    users = []
    error = false
    [params[:tweets][:user1], params[:tweets][:user2], params[:tweets][:user3]].each_with_index do |id, i| 
      begin
        if id.present?
            user_tweets =  last_ids[i].blank? ? Twitter.user_timeline(id) : Twitter.user_timeline(id, since_id: last_ids[i])
            last_ids[i] = user_tweets.first.id if user_tweets.present? 
            @tweets += user_tweets
            users[i] = id
        end 
      rescue
        error = true
      end
    end
    @tweets.sort!{|a,b| b.id <=> a.id }
    render :json => {:tweets_list => render_to_string(:partial => "tweet_list.html.erb"), :last_ids => last_ids, :error => error, :valid_users => users.compact.join(", ")}
  end
end
