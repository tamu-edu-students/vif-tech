class About < ApplicationRecord
    serialize :social_links, Hash
    validates :firstname, presence: true
    validates :firstname, length: { minimum: 1 }
    validates :lastname, presence: true
    validates :lastname, length: { minimum: 1 }
    validates :rank,
    :inclusion  => { :in => [ 'director', 'faculty', 'normal', 'vif-tech'],
                     :message    => "%{value} is not a valid rank" }
end
