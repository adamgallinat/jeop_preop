module Api
	class CluesController < ApplicationController

		def show
			@clue = Clue.find(params[:id])
			render json: @clue
		end
	end
end