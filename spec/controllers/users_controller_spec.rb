require_relative '../rails_helper'

describe UsersController do

	it { should permit(:username).for(:create) }
	it { should permit(:password).for(:create) }
	it { should permit(:password_confirmation).for(:create) }

end