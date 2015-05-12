require_relative '../rails_helper'

describe Category do

	it { should validate_presence_of :title }

	it { should validate_presence_of :season }
	it { should validate_numericality_of :season }
	
	it { should validate_presence_of :air_date }
	it { should allow_value('1999-01-01').for(:air_date) }
	it { should_not allow_value('not a date').for(:air_date) }

end