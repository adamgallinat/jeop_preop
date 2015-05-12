require_relative '../rails_helper'

describe Score do

	it { should validate_presence_of :value }
	it { should validate_numericality_of :value }

	it { should validate_presence_of :user_id }
	it { should belong_to(:user).class_name('User') }	

end