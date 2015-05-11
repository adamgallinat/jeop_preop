module Api
	class CluesController < ApplicationController

		def index
			@clues = Clue.all
			render json: @clues
		end

		def show
			@clue = Clue.find(params[:id])
			render json: @clue
		end
	end
end