require_relative '../rails_helper'

describe Clue do

	it { should validate_numericality_of :value }
	it { should validate_inclusion_of(:value)
		.in_array([0,100,200,300,400,500,600,800,1000]) }
	
	it { should validate_presence_of :category_id }
	it { should belong_to(:category).class_name('Category') }

end