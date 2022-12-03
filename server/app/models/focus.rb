class Focus < ApplicationRecord
    validates :focus, presence: true, uniqueness: true 
end
