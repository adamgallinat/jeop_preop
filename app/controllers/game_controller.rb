class GameController < ApplicationController

	def index
		if current_user
			respond_to do |format|
				format.html {}
			end
		else
			redirect_to sessions_path
		end
	end

end