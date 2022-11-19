class About < ApplicationRecord
    has_many :social_links, dependent: :destroy
    accepts_nested_attributes_for :social_links

    validates :firstname, presence: true
    validates :firstname, length: { minimum: 1 }
    validates :lastname, presence: true
    validates :lastname, length: { minimum: 1 }
    validates :role, presence: true
    validates :rank,
    :inclusion  => { :in => ['director', 'faculty', 'normal', 'vif-tech'],
                     :message    => "%{value} is not a valid rank" }

end
