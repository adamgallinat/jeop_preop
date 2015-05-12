require_relative '../rails_helper'

describe User do

	it { should validate_presence_of :username }
	it { should validate_uniqueness_of :username }
	it { should validate_length_of(:username)
		.is_at_least(6) }
	it { should validate_length_of(:password)
		.is_at_least(6) }

end