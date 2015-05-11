class SessionsController < ApplicationController

	def new
	end

	def create
		@username = params[:username]
		@password = params[:password]
		@password_confirmation = params[:password_confirmation]

		@user = User.find_by(username: @username)
		if @user && @user.authenticate(@password)
			session[:current_user] = @user.id
			redirect_to root_path
		else
			redirect_to sessions_path
		end
	end

	def destroy
		session[:current_user] = nil
		redirect_to root_path
	end

	def current_user
		@session = {
			id: session[:current_user]
		}

		render json: @session
	end

end