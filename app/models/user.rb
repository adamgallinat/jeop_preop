class User < ActiveRecord::Base
	has_secure_password

	validates :username, presence: true
	validates :username, length: {minimum: 6}
	validates :username, uniqueness: true

	validates :password, length: {minimum: 6}

	has_many :scores
end