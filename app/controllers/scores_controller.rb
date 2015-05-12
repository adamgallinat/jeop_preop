class ScoresController < ApplicationController

	# def index
	# 	if current_user
	# 		@scores = Score.all
	# 		render json: @scores
	# 	else
	# 		render json: {error: 'Not logged in!'}, status: 401
	# 	end
	# end

	# def show
	# 	if current_user
	# 		@score = Score.find(params[:id])
	# 		render json: @score
	# 	else
	# 		render json: {error: 'Not logged in!'}, status: 401
	# 	end
	# end

	def create
		@score = Score.new
		@score.value = params[:value]
		@score.user_id = params[:user_id]
		@score.save

		render json: @score
	end

	# def delete
	# 	@score = Score.find(params[:id])
	# 	@score.delete

	# 	render json: score
	# end

	def by_user
		if current_user && current_user == params[:user_id].to_i
			@scores = Score.where(user_id: params[:user_id])
			render json: @scores
		elsif current_user && (current_user != params[:user_id])
			render json: {error: 'Not logged in as this user'}, status: 403
		else
			render json: {error: 'Not logged in'}, status: 401
		end
	end

end