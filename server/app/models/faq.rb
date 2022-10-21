class Faq < ApplicationRecord

    validates :question, presence: true, length: { minimum: 10 }
    validates :answer, presence: true, length: { minimum: 2 }

end
